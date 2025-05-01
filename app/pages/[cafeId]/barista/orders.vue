

<script setup lang="ts">
import { Client, Databases, Query, ID, type Models } from 'appwrite'

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe');
const databases = new Databases(client);
const route = useRoute()
const orders = ref([] as Array<Models.Document>)
const pastOrders = ref([] as Array<Models.Document>)
// use custom head for this page
useHead({
    title: 'Barista Dashboard',
    meta: [
        { name: 'description', content: 'Barista Dashboard' }
    ],
    script: [
        { src: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js', defer: true },
        {
            innerHTML: `
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                OneSignalDeferred.push(async function(OneSignal) {
                    await OneSignal.init({
                    appId: "a03fd055-755b-47ff-b5c8-859532f50534",
                    safari_web_id: "web.onesignal.auto.1d9d9717-02c9-46fa-a0ca-aedc9bb61733",
                    notifyButton: {
                        enable: true,
                    },
                    });
                });`
        }
    ],
})


orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])).documents.filter((order) => order.status === 'ordered')
pastOrders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])).documents.filter((order) => order.status !== 'ordered').slice(0, 3)

onMounted(async () => {
        client.subscribe(`databases.cafe.collections.order.documents`, async (response) => {
            if (response.payload.cafeId.$id === route.params.cafeId) {
                orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])).documents.filter((order) => order.status === 'ordered')
                pastOrders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])).documents.filter((order) => order.status !== 'ordered').slice(0, 3)
            }
    })
})

const completeOrder = async (orderId: string) => {
    await databases.updateDocument('cafe', 'order', orderId, {
        status: 'completed'
    })
}

const cancelOrder = async (orderId: string) => {
    await databases.updateDocument('cafe', 'order', orderId, {
        status: 'canceled'
    })
}
</script>


<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">Order</h1>
        <div class="flex flex-col justify-center grow"></div>
        <UCard
           variant="soft"
           v-for="order in orders"
           :key="order.$id"
           class="mb-4 bg-white drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
            <div>{{ order.item.name }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
            <template #footer>
                <div class="flex flex-row space-x-3 justify-end">
                    <UButton color="error" @click="cancelOrder(order.$id)">Cancel</UButton>
                    <UButton color="success" @click="completeOrder(order.$id)">Complete</UButton>
                </div>
            </template>
        </UCard>
        <h2 class="font-bold text-xl mb-4 ml-4 sm:ml-6">Past Orders</h2>
        <UCard
            variant="soft"
            v-for="order in pastOrders"
            :key="order.$id"
            class="mb-4 bg-white drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
            <div>{{ order.item.name }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
            <template #footer>
                <div class="flex flex-row space-x-3 justify-end">
                    <div>{{ order.status  }}</div>
                </div>
            </template>
        </UCard>
        <div class="flex flex-col justify-center grow"></div>
    </div>
</template>