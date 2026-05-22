<script setup lang="ts">
import { Query, ID, type Models } from "appwrite";
const route = useRoute();
const items = ref([] as any[]);
const selectedItem = ref(null as any);
const selectedOptions = ref([] as any[]);
const isOpenOptions = ref(false);
const showModalExtras = ref(false);
const isOrderSending = ref(false);
const isOrderSent = ref(false);
const orders = ref([] as Array<Models.Document>);
const localSavedOrders = ref([] as Array<string>);
const clientName = ref("");

const { $appwrite } = useNuxtApp();
const databases = $appwrite.databases;
const client = $appwrite.client;
const toast = useToast();

let itemsPromise = databases.listDocuments("cafe", "item", [
    Query.equal("cafeId", route.params.cafeId as string),
]);
let cafePromise = null as any;

try {
    cafePromise = await databases.getDocument(
        "cafe",
        "cafe",
        route.params.cafeId as string,
    );
} catch (error) {
    console.log(error);
    navigateTo("/invalid-cafe");
}

/*
Setup the HEAD of this page so it is PWA ready
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>My Awesome App</title>
  <meta name="description" content="My Awesome App description">
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF">
  <meta name="theme-color" content="#ffffff">
</head>
*/
const head = useHead({
    title: cafePromise.name,
    meta: [
        { name: "viewport", content: "width=device-width,initial-scale=1" },
        {
            name: "description",
            content: `Order your favorite items from ${cafePromise.name}`,
        },
        { name: "theme-color", content: "#f0e4d2" },
    ],
    link: [
        { rel: "icon", href: "/favicon.ico" },
        {
            rel: "apple-touch-icon",
            href: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
        },
        {
            rel: "mask-icon",
            href: "/maskable-icon-512x512.png",
            color: "#f0e4d2",
        },
    ],
});

itemsPromise.then(
    function (response) {
        items.value = response.documents;
    },
    function (error) {
        console.log(error);
    },
);

watch(selectedItem, async (newSelectedItem) => {
    if (!newSelectedItem) {
        console.log("selectedItem is null");
        selectedOptions.value = [];
        return;
    }
    selectedOptions.value = newSelectedItem.options
        .map((element: string) => {
            //console.log(element)
            if (!element) return undefined;
            const parse1 = element.split(":");
            if (parse1.length === 2) {
                const name = parse1[0];
                const tmpOptions = parse1[1] as string;
                const options =
                    tmpOptions == "boolean" ? false : tmpOptions.split(";");

                return {
                    name: name,
                    options: options,
                    value: options === false ? false : "0",
                };
            }
            return undefined;
        })
        .filter((element: any) => element !== undefined)
        .sort((element: any) => (element.options === false ? 1 : -1));
});

function withViewTransition(fn: () => void): Promise<void> {
    const doc = typeof document !== "undefined" ? (document as any) : null;
    if (doc?.startViewTransition) {
        const t = doc.startViewTransition(async () => {
            fn();
            await nextTick();
        });
        return t.finished.catch(() => { });
    } else {
        fn();
        return Promise.resolve();
    }
}

async function openItem(item: any) {
    history.pushState({ modalOpen: true }, "");
    showModalExtras.value = false;
    selectedItem.value = item;
    await nextTick();
    await withViewTransition(() => {
        isOpenOptions.value = true;
    });
    showModalExtras.value = true;
}

async function closeItem() {
    if (history.state?.modalOpen) {
        history.back();
    } else {
        showModalExtras.value = false;
        await withViewTransition(() => {
            isOpenOptions.value = false;
        });
        selectedItem.value = null;
    }
}

async function onPopState() {
    if (isOpenOptions.value) {
        showModalExtras.value = false;
        await withViewTransition(() => {
            isOpenOptions.value = false;
        });
        selectedItem.value = null;
    }
}

onBeforeUnmount(() => {
    window.removeEventListener("popstate", onPopState);
});

onMounted(async () => {
    window.addEventListener("popstate", onPopState);
    // if localstorage is available, store the current cafe ID in the localstorage
    if (localStorage) {
        localStorage.setItem("lastVisitedCafe", cafePromise.$id);
    }

    // get the list of order ids from the localstorage and get the orders from the database
    const ordersIds = localStorage.getItem("orders");

    if (ordersIds) {
        localSavedOrders.value = JSON.parse(ordersIds);
        orders.value = (
            await databases.listDocuments("cafe", "order", [
                Query.equal("cafeId", route.params.cafeId as string),
                Query.equal("$id", localSavedOrders.value),
            ])
        ).documents
            .reverse()
            .filter((o: Models.Document) => o.item !== null);
    }
    client.subscribe(
        `databases.cafe.collections.order.documents`,
        async (response: any) => {
            if (response.payload.cafeId.$id === route.params.cafeId) {
                orders.value = (
                    await databases.listDocuments("cafe", "order", [
                        Query.equal("cafeId", route.params.cafeId as string),
                        Query.equal("$id", localSavedOrders.value),
                    ])
                ).documents
                    .reverse()
                    .filter((o: Models.Document) => o.item !== null);
            }
        },
    );
    // get the surname of the customer from the localstorage
    clientName.value = localStorage.getItem("clientName") || "";
});

function orderStatusText(order: Models.Document) {
    switch (order.status) {
        case "ordered":
            return "Your order is being prepared";
        case "completed":
            return "Your order is ready !";
        case "canceled":
            return "Your order has been canceled";
        default:
            return "Unknown status";
    }
}

async function cancelOrder(orderId: string) {
    try {
        await databases.updateDocument("cafe", "order", orderId, {
            status: "canceled",
        });
        // Mettre à jour le statut localement
        const order = orders.value.find((o) => o.$id === orderId);
        if (order) {
            order.status = "canceled";
        }
        toast.add({
            title: "Order canceled",
            description: "Your order has been canceled successfully.",
            icon: "i-lucide-check",
            color: "success",
        });
    } catch (error) {
        console.error(error);
        toast.add({
            title: "Error",
            description: "Failed to cancel your order. Please try again.",
            icon: "i-lucide-alert-circle",
            color: "error",
        });
    }
}

function sendCommand() {
    isOrderSending.value = true;
    // Sauvegarder le nom du client dans le local storage
    localStorage.setItem("clientName", clientName.value);
    const sendOrderPromise = databases
        .createDocument("cafe", "order", ID.unique(), {
            item: selectedItem.value.$id,
            cafeId: route.params.cafeId as string,
            status: "ordered",
            clientName: clientName.value || "Anon",
            options: selectedOptions.value
                .filter((op) => op.value !== false)
                .map(
                    (op) =>
                        `${op.options === false ? op.name : op.options[op.value]}`,
                ),
        })
        .catch(function (error) {
            console.error(error);
            isOrderSending.value = false;
            toast.add({
                title: "Error",
                description: "Failed to send your order. Please try again.",
                icon: "i-lucide-alert-circle",
                color: "error",
            });
        })
        .then(function (response) {
            console.log(response);
            if (!response || !response.$id) return;
            isOrderSending.value = false;
            // Sauvegarder la commande dans le local storage avec la liste des commandes passées
            const savedOrders = localStorage.getItem("orders");
            if (savedOrders) {
                localSavedOrders.value = JSON.parse(savedOrders);
                localSavedOrders.value.push(response.$id);
                localStorage.setItem(
                    "orders",
                    JSON.stringify(localSavedOrders.value),
                );
            } else {
                localStorage.setItem("orders", JSON.stringify([response.$id]));
                localSavedOrders.value = [response.$id];
            }
            // Ajouter la commande à la liste affichée
            orders.value.unshift(response);
            toast.add({
                title: "Order sent",
                description: "Your order has been sent successfully.",
                icon: "i-lucide-check",
                color: "success",
            });
            selectedOptions.value = [];
            closeItem();
        });
}
</script>

<template>
    <div class="bg-latte p-8 min-h-screen flex flex-col text-coffee">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6 text-coffee">
            {{ cafePromise.name }}
        </h1>
        <NuxtLink :to="`/${route.params.cafeId}/barista`">
            <UButton class="fixed top-4 right-4 z-10 bg-coffee-500 hover:bg-coffee-600 text-white">
                Be the barista
                <UIcon name="i-hugeicons:coffee-02" />
            </UButton>
        </NuxtLink>
        <div class="flex flex-col justify-center grow">
            <h2 class="font-bold text-2xl mb-4 ml-4 sm:ml-6 text-coffee">
                Menu
            </h2>
            <div class="grid grid-cols-2 gap-3 mb-4">
                <button v-for="item of items" :key="item.$id" type="button" @click="openItem(item)"
                    class="border-2 border-coffee-500 overflow-hidden bg-white dark:bg-latte-50 text-left flex flex-col hover:bg-latte-100 dark:hover:bg-latte-200 transition-colors"
                    :style="{
                        viewTransitionName:
                            (selectedItem && selectedItem.$id !== item.$id) ||
                                (selectedItem?.$id === item.$id && isOpenOptions)
                                ? 'none'
                                : `card-${item.$id}`,
                    }">
                    <div class="aspect-square w-full bg-latte-100">
                        <img :src="item.imageUrl || '/images-cafe/mug.png'" :alt="item.name"
                            class="w-full h-full object-cover" :style="{
                                viewTransitionName:
                                    (selectedItem && selectedItem.$id !== item.$id) ||
                                        (selectedItem?.$id === item.$id && isOpenOptions)
                                        ? 'none'
                                        : `item-${item.$id}`,
                            }" />
                    </div>
                    <div class="flex items-center justify-between gap-2 px-3 py-2 border-t-2 border-coffee-500">
                        <div class="font-medium text-coffee truncate">
                            {{ item.name }}
                        </div>
                        <div v-if="item.price" class="text-coffee-600 text-sm shrink-0">
                            {{ item.price }}
                        </div>
                    </div>
                </button>
            </div>
            <h2 key="pastOrders" class="font-bold text-2xl mb-4 ml-4 sm:ml-6 text-coffee">
                Past Orders
            </h2>
            <UCard v-for="order in orders" :key="order.$id" variant="soft"
                class="mt-2 flex flex-col bg-white dark:bg-latte-50 drop-shadow-xl rounded-lg">
                <div class="flex flex-col justify-between">
                    <div class="font-bold text-2xl text-coffee">
                        {{ order.item?.name || "Unknown item" }}
                    </div>
                    <div class="font-mono text-gray-500 dark:text-gray-400 text-sm">
                        #{{ order.$id }}
                    </div>
                    <div class="mt-4 text-coffee">
                        {{ order.options.join(", ") }}
                    </div>
                    <div class="flex flex-row justify-between items-center">
                        <div :class="{
                            'text-green-600': order.status === 'completed',
                            'text-yellow-600': order.status === 'ordered',
                            'text-red-600': order.status === 'canceled',
                        }">
                            {{ orderStatusText(order) }}
                        </div>
                        <UButton v-if="order.status === 'ordered'" size="sm" variant="soft" color="error" loading-auto
                            @click="cancelOrder(order.$id)">
                            Cancel
                        </UButton>
                    </div>
                </div>
            </UCard>
        </div>
        <UModal :open="isOpenOptions" @update:open="(v: boolean) => { if (!v) closeItem(); }" fullscreen :close="false"
            :ui="{
                content: 'bg-white dark:bg-latte-50',
                overlay: 'bg-coffee/50',
                body: 'p-0',
            }">
            <template #content>
                <div class="flex flex-col h-dvh bg-white dark:bg-latte-50 border-2 border-coffee-500 overflow-hidden"
                    :style="{
                        viewTransitionName: selectedItem
                            ? `card-${selectedItem.$id}`
                            : 'none',
                    }">
                    <div class="relative shrink-0">
                        <img :src="selectedItem?.imageUrl ||
                            '/images-cafe/mug.png'
                            " :alt="selectedItem?.name" class="w-full h-72 sm:h-96 object-cover" :style="{
                                viewTransitionName: selectedItem
                                    ? `item-${selectedItem.$id}`
                                    : 'none',
                            }" />
                        <UButton icon="i-lucide-x" color="neutral" variant="solid" size="md" @click="closeItem"
                            aria-label="Close"
                            class="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white text-coffee shadow transition-opacity duration-300"
                            :class="showModalExtras ? 'opacity-100' : 'opacity-0'
                                " />
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 transition-opacity duration-300"
                        :class="showModalExtras ? 'opacity-100' : 'opacity-0'">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="font-bold text-2xl text-coffee">
                                {{ selectedItem?.name }}
                            </h2>
                            <div v-if="selectedItem?.price" class="text-coffee-600 text-lg">
                                {{ selectedItem.price }}
                            </div>
                        </div>
                        <div v-if="selectedItem?.description" class="text-coffee-600 italic mb-4">
                            {{ selectedItem.description }}
                        </div>
                        <div v-for="opt of selectedOptions" :key="opt.name" class="mb-4">
                            <div v-if="opt.options === false" class="flex flex-row justify-between">
                                <div class="text-coffee">
                                    {{ opt.name }}
                                </div>
                                <USwitch color="primary" v-model="opt.value"></USwitch>
                            </div>
                            <div v-else class="flex flex-col">
                                <UTabs :content="false" :items="opt.options.map((o: string) => {
                                    return { label: o, slot: o };
                                })
                                    " v-model="opt.value" default-value="0" :ui="{
                                        list: {
                                            background: 'bg-latte-100',
                                            marker: {
                                                background: 'bg-white',
                                            },
                                            tab: {
                                                active: 'text-coffee',
                                                inactive: 'text-gray-500',
                                            },
                                        },
                                    }"></UTabs>
                            </div>
                        </div>
                        <UFormField label="Your name" class="mt-4">
                            <UInput v-model="clientName" placeholder="Your name"
                                class="bg-white text-coffee focus:ring-coffee-500"></UInput>
                        </UFormField>
                        <div class="flex flex-row justify-end mt-4">
                            <UButton :loading="isOrderSending" size="xl"
                                class="rounded-full bg-coffee-500 hover:bg-coffee-600 text-white" @click="sendCommand">
                                Order</UButton>
                        </div>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>
