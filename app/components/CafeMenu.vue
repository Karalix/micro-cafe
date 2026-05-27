<script setup lang="ts">
interface MenuItem {
    $id: string;
    name: string;
    price?: string;
    description?: string;
    options: string[];
    imageUrl?: string;
}

const props = defineProps<{
    cafe: { name: string };
    items: MenuItem[];
    orders: any[];
    submitOrder: (payload: {
        item: MenuItem;
        options: string[];
        clientName: string;
    }) => Promise<void>;
    cancelOrder: (orderId: string) => Promise<void>;
    initialClientName?: string;
    baristaLink?: string;
}>();

const selectedItem = ref<MenuItem | null>(null);
const selectedOptions = ref([] as any[]);
const isOpenOptions = ref(false);
const showModalExtras = ref(false);
const isOrderSending = ref(false);
const clientName = ref(props.initialClientName ?? "");

watch(
    () => props.initialClientName,
    (newName) => {
        if (newName && !clientName.value) clientName.value = newName;
    },
);

watch(selectedItem, (newSelectedItem) => {
    if (!newSelectedItem) {
        selectedOptions.value = [];
        return;
    }
    selectedOptions.value = newSelectedItem.options
        .map((element: string) => {
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

async function openItem(item: MenuItem) {
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

onMounted(() => {
    window.addEventListener("popstate", onPopState);
});

onBeforeUnmount(() => {
    window.removeEventListener("popstate", onPopState);
});

function orderStatusText(order: any) {
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

async function onSendCommand() {
    if (!selectedItem.value) return;
    isOrderSending.value = true;
    const optionsPayload = selectedOptions.value
        .filter((op) => op.value !== false)
        .map(
            (op) =>
                `${op.options === false ? op.name : op.options[op.value]}`,
        );
    try {
        await props.submitOrder({
            item: selectedItem.value,
            options: optionsPayload,
            clientName: clientName.value || "Anon",
        });
        selectedOptions.value = [];
        closeItem();
    } catch (e) {
        // Parent owns error feedback
    } finally {
        isOrderSending.value = false;
    }
}
</script>

<template>
    <div class="bg-latte p-8 min-h-screen flex flex-col text-coffee">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6 text-coffee">
            {{ cafe.name }}
        </h1>
        <NuxtLink v-if="baristaLink" :to="baristaLink">
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
                        <img :src="itemImage(item.imageUrl, 'thumb')" :alt="item.name" loading="lazy" decoding="async"
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
                            @click="() => cancelOrder(order.$id)">
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
                        <img :src="itemImage(selectedItem?.imageUrl, 'large')" :alt="selectedItem?.name" class="w-full h-72 sm:h-96 object-cover" decoding="async" :style="{
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
                                class="rounded-full bg-coffee-500 hover:bg-coffee-600 text-white" @click="onSendCommand">
                                Order</UButton>
                        </div>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>
