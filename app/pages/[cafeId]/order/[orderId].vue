<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">Order</h1>
        <div class="flex flex-col justify-center grow"></div>
        <UCard
            variant="soft"
            class="flex flex-row bg-white drop-shadow-xl rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
            <div>Go back</div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { Client, Databases, Query, ID } from 'appwrite'

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe');
const databases = new Databases(client);
const route = useRoute()
const order = ref(null as any)
onMounted(async () => {
    order.value = await databases.getDocument('cafe', 'order', route.params.orderId as string)
})
</script>