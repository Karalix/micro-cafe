<script setup lang="ts">
import { Query, ID, type Models } from "appwrite";
const route = useRoute();
const items = ref([] as any[]);
const orders = ref([] as Array<Models.Document>);
const localSavedOrders = ref([] as Array<string>);
const initialClientName = ref("");

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

useHead({
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

onMounted(async () => {
    if (localStorage) {
        localStorage.setItem("lastVisitedCafe", cafePromise.$id);
    }

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
    initialClientName.value = localStorage.getItem("clientName") || "";
});

async function submitOrder(payload: {
    item: any;
    options: string[];
    clientName: string;
}) {
    localStorage.setItem("clientName", payload.clientName);
    try {
        const response = await databases.createDocument(
            "cafe",
            "order",
            ID.unique(),
            {
                item: payload.item.$id,
                cafeId: route.params.cafeId as string,
                status: "ordered",
                clientName: payload.clientName,
                options: payload.options,
            },
        );
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
        orders.value.unshift(response);
        toast.add({
            title: "Order sent",
            description: "Your order has been sent successfully.",
            icon: "i-lucide-check",
            color: "success",
        });
    } catch (error) {
        console.error(error);
        toast.add({
            title: "Error",
            description: "Failed to send your order. Please try again.",
            icon: "i-lucide-alert-circle",
            color: "error",
        });
        throw error;
    }
}

async function cancelOrder(orderId: string) {
    try {
        await databases.updateDocument("cafe", "order", orderId, {
            status: "canceled",
        });
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
</script>

<template>
    <CafeMenu :cafe="cafePromise" :items="items" :orders="orders" :submit-order="submitOrder"
        :cancel-order="cancelOrder" :initial-client-name="initialClientName"
        :barista-link="`/${route.params.cafeId}/barista`" />
</template>
