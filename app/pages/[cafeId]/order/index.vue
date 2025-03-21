

<script setup lang="ts">
import { Client, Databases, Query, ID, type Models } from 'appwrite'

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe');
const databases = new Databases(client);
const route = useRoute()
const orders = ref([] as Array<Models.Document>)
const pastOrders = ref([] as Array<Models.Document>)


onMounted(async () => {
    // get the list of order ids from the localstorage and get the orders from the database
    const ordersIds = localStorage.getItem('orders')
    if (ordersIds) {
        const ordersArray = JSON.parse(ordersIds)
        orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])).documents.filter((order) => ordersArray.includes(order.$id)).reverse()
    }
    client.subscribe(`databases.cafe.collections.order.documents`, async (response) => {
        if (response.payload.cafeId.$id === route.params.cafeId) {
            orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])).documents.filter((order) => ordersArray.includes(order.$id)).reverse()
        }
    })
})

function orderStatusText (order) {
    switch (order.status) {
        case 'ordered':
            return 'Your order is being prepared'
        case 'completed':
            return 'Your order is ready !'
        case 'canceled':
            return 'Your order has been canceled'
        default:
        return 'Unknown status'
    }
}
</script>


<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">Order</h1>
        <div class="flex flex-col justify-center grow"></div>
        <UCard v-for="order in orders" :key="order.$id" variant="soft" class="mt-2 flex flex-col bg-white drop-shadow-xl rounded-2xl">
               <div class="flex flex-col justify-between">
                    <div class="font-bold text-2xl">{{ order.item.name  }}</div>
                    <div class="font-mono text-stone-500 text-sm">#{{ order.$id }}</div>
                    <div class="mt-4">{{ order.options.join(', ')  }}</div>
                    <div :class="{'text-green-300': order.status === 'completed', 'text-yellow-300': order.status === 'ordered', 'text-red-300': order.status === 'canceled'}">
                        {{ orderStatusText(order) }}
                    </div>
                </div>
            </UCard>
        <div class="flex flex-col justify-center grow"></div>
        <UCard
            variant="soft"
            class="flex flex-row bg-white drop-shadow-xl rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
            <div>Go back</div>
        </UCard>
    </div>
</template>