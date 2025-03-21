<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">Order</h1>
        <div class="flex flex-col justify-center grow">
            <UCard v-if="order" variant="soft" class="flex flex-col bg-white drop-shadow-xl rounded-2xl">
               <div class="flex flex-col justify-between">
                    <div class="font-bold text-2xl">{{ order.item.name  }}</div>
                    <div class="font-mono text-stone-500 text-sm">#{{ order.$id }}</div>
                    <div class="mt-4">{{ order.options.join(', ')  }}</div>
                    <div :class="{'text-green-300': order.status === 'completed', 'text-yellow-300': order.status === 'ordered', 'text-red-300': order.status === 'canceled'}">
                        {{ orderStatusText }}
                    </div>
                </div>
            </UCard>
        </div>
        <nuxt-link :to="`/${route.params.cafeId}`">
            <UCard
                variant="soft"
                class="flex flex-row bg-white drop-shadow-xl rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
                <div>Go back to the menu</div>
            </UCard>
        </nuxt-link>
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
const orderStatusText = computed(() => {
    switch (order.value.status) {
        case 'ordered':
            return 'Your order is being prepared'
        case 'completed':
            return 'Your order is ready !'
        case 'canceled':
            return 'Your order has been canceled'
        default:
        return 'Unknown status'
    }
})
</script>