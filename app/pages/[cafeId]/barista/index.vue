<script setup lang="ts">
import { Query, type Models } from 'appwrite'

const { $appwrite } = useNuxtApp();
const { syncPushTarget } = usePushTarget();
const databases = $appwrite.databases;
const account = $appwrite.account;
const client = $appwrite.client;
const route = useRoute()
const orders = ref([] as Array<Models.Document>)
const pastOrders = ref([] as Array<Models.Document>)
const { add: addToast } = useToast(); // Optional: For success/error notifications
const showNotificationPrompt = ref(false);

// Define an interface for the expected structure of response.payload
// This should match the structure of a document in your 'order' collection
interface OrderPayload {
  cafeId: {
    $id: string;
    // Add any other properties of the cafeId object if they exist
  };
  // Add other properties of the order document that you might need
  // e.g., status: string;
  // e.g., items: any[]; // Be more specific if possible
}

// If user is not logged in, redirect to login page
try {
    await account.getSession('current')
} catch (error) {
    navigateTo('/login')
}

const refreshOrders = async () => {
    orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string), Query.equal('status', 'ordered'), Query.orderDesc('$createdAt')])).documents;
    pastOrders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string), Query.notEqual('status', 'ordered'), Query.orderDesc('$createdAt')])).documents.slice(0, 3);
}

await refreshOrders();

onMounted(async () => {
    client.subscribe(`databases.cafe.collections.order.documents`, async (response) => {
        // Assert the type of response.payload to your defined interface
        const payload = response.payload as OrderPayload;

        // Now you can safely access properties defined in OrderPayload.
        // It's also a good practice to check for the existence of nested objects
        // before accessing their properties, if they can be optional.
        if (payload && payload.cafeId && payload.cafeId.$id === route.params.cafeId) {
            await refreshOrders();
        }
    });
    if (Notification.permission === 'default') {
        showNotificationPrompt.value = true
    } else {
        showNotificationPrompt.value = false
    }
})

const requestNotificationPermission = async () => {
    try {
        await syncPushTarget({ requestPermission: true });
    } catch (err) {
        console.error('Failed to register push target:', err);
    } finally {
        showNotificationPrompt.value = false;
    }
}

const completeOrder = async (orderId: string) => {
    await databases.updateDocument('cafe', 'order', orderId, {
        status: 'completed'
    })
    await refreshOrders();
}

const cancelOrder = async (orderId: string) => {
    await databases.updateDocument('cafe', 'order', orderId, {
        status: 'canceled'
    })
    await refreshOrders();
}

</script>


<template>
    <div class="bg-latte p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6 text-coffee">{{ $t('baristaOrders.title') }}</h1>
        <UButton v-if="showNotificationPrompt" @click="requestNotificationPermission" class="mb-4 ml-4 sm:ml-6 bg-coffee-500 hover:bg-coffee-600 text-white">{{ $t('baristaOrders.enableNotifications') }}</UButton>
        
        <div v-if="orders.length === 0 && pastOrders.length === 0" class="flex flex-col items-center justify-center grow py-12 text-center">
            <UIcon name="i-heroicons-inbox" class="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 class="text-xl font-semibold text-coffee mb-2">{{ $t('baristaOrders.emptyTitle') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('baristaOrders.emptyText') }}</p>
            <UButton :to="`/${route.params.cafeId}/barista/cafe`" class="bg-coffee-500 hover:bg-coffee-600 text-white" :label="$t('baristaOrders.shareCafe')" icon="i-heroicons-share" />
        </div>

        <UCard
           v-for="order in orders"
           :key="order.$id"
           class="mb-4 text-coffee bg-white dark:bg-latte-50 drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-latte-50 dark:hover:bg-latte-100 active:drop-shadow-md transition-all ring-1 ring-gray-200 dark:ring-gray-700">
            <div>{{ order.item?.name || $t('baristaOrders.unknownItem') }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
            <template #footer>
                <div class="flex flex-row space-x-3 justify-end">
                    <UButton color="error" variant="ghost" @click="cancelOrder(order.$id)">{{ $t('baristaOrders.cancel') }}</UButton>
                    <UButton color="primary" variant="solid" @click="completeOrder(order.$id)">{{ $t('baristaOrders.complete') }}</UButton>
                </div>
            </template>
        </UCard>
        <h2 class="font-bold text-xl mb-4 ml-4 sm:ml-6 text-coffee">{{ $t('baristaOrders.pastOrders') }}</h2>
        <UCard
            v-for="order in pastOrders"
            :key="order.$id"
            class="mb-4 text-gray-600 dark:text-gray-400 bg-white dark:bg-latte-50 drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-latte-50 dark:hover:bg-latte-100 active:drop-shadow-md transition-all ring-1 ring-gray-200 dark:ring-gray-700">
            <div>{{ order.item?.name || $t('baristaOrders.unknownItem') }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
            <template #footer>
                <div class="flex flex-row space-x-3 justify-end">
                    <div>{{ $t(`baristaOrders.statusLabel.${order.status}`) }}</div>
                </div>
            </template>
        </UCard>
        <div class="flex flex-col justify-center grow"></div>
              <UNavigationMenu class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-white dark:bg-latte-50 drop-shadow-md" :items="[{label: $t('nav.orders'), to: `/${route.params.cafeId}/barista`}, {label: $t('nav.menu'), to: `/${route.params.cafeId}/barista/menu`}, {label: $t('nav.cafe'), to: `/${route.params.cafeId}/barista/cafe`}]" />
    </div>
</template>