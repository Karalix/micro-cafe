<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">Order</h1>
        <div class="flex flex-col justify-center grow"></div>
        <UCard
           variant="soft"
           v-for="order in orders.documents.filter((order: any) => order.status === 'ordered')"
           :key="order.$id"
           class="flex flex-row bg-white drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
            <div>{{ order.item.name }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
        </UCard>
        <div class="flex flex-col justify-center grow"></div>
        <UCard
            variant="soft"
            class="flex flex-row bg-white drop-shadow-xl rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
            <div>Go back</div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { Client, Databases, Query, ID, type Models } from 'appwrite'

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe');
const databases = new Databases(client);
const route = useRoute()
const orders = ref({} as Models.DocumentList<Models.Document>)

orders.value = await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])

client.subscribe(`databases.${route.params.cafeId}.collections.order.documents`, async (response) => {
    orders.value = await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])
})

</script>