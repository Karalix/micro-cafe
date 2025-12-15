<script setup lang="ts">
import { Query, type Models } from 'appwrite'
import { getMessaging, getToken } from "firebase/messaging";

const { $appwrite } = useNuxtApp();
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
    // Manage Push Notifications
    console.log('Requesting permission...');
    const { $firebase } = useNuxtApp()
    Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('Notification permission granted.');
        const messaging = getMessaging($firebase);
        getToken(messaging, {vapidKey: 'BH9Kq8XtWbSxZzebYCcU9weUMEXNbH94fj2gtQeSpp2Y9JDIwzGdbKAM8BgZQerB7QLUJqTDsFswGFH01UEFP9k'})
            .then((currentToken) => {
                if (currentToken) {
                    console.log('Token received: ')
                    console.log(currentToken)
                    account.createPushTarget('unique()', currentToken, 'firebase')
                    showNotificationPrompt.value = false
                } else {
                    console.log('No registration token available. Request permission to generate one.')
                    showNotificationPrompt.value = false
                }
            }
        ).catch((err) => {
            console.log('An error occurred while retrieving token. ', err)
        })
    } else {
        console.log('Unable to get permission to notify.');
    }
    });
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
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6 text-coffee">Order</h1>
        <UButton v-if="showNotificationPrompt" @click="requestNotificationPermission" class="mb-4 ml-4 sm:ml-6 bg-coffee-500 hover:bg-coffee-600 text-white">Receive a notification when a new order is placed</UButton>
        
        <div v-if="orders.length === 0 && pastOrders.length === 0" class="flex flex-col items-center justify-center grow py-12 text-center">
            <UIcon name="i-heroicons-inbox" class="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 class="text-xl font-semibold text-coffee mb-2">No orders yet</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Share your café page to start receiving orders!</p>
            <UButton :to="`/${route.params.cafeId}/barista/cafe`" class="bg-coffee-500 hover:bg-coffee-600 text-white" label="Share my Café" icon="i-heroicons-share" />
        </div>

        <UCard
           v-for="order in orders"
           :key="order.$id"
           class="mb-4 text-coffee bg-white dark:bg-latte-50 drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-latte-50 dark:hover:bg-latte-100 active:drop-shadow-md transition-all ring-1 ring-gray-200 dark:ring-gray-700">
            <div>{{ order.item?.name || 'Unknown item' }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
            <template #footer>
                <div class="flex flex-row space-x-3 justify-end">
                    <UButton color="error" variant="ghost" @click="cancelOrder(order.$id)">Cancel</UButton>
                    <UButton color="primary" variant="solid" @click="completeOrder(order.$id)">Complete</UButton>
                </div>
            </template>
        </UCard>
        <h2 class="font-bold text-xl mb-4 ml-4 sm:ml-6 text-coffee">Past Orders</h2>
        <UCard
            v-for="order in pastOrders"
            :key="order.$id"
            class="mb-4 text-gray-600 dark:text-gray-400 bg-white dark:bg-latte-50 drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-latte-50 dark:hover:bg-latte-100 active:drop-shadow-md transition-all ring-1 ring-gray-200 dark:ring-gray-700">
            <div>{{ order.item?.name || 'Unknown item'  }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
            <template #footer>
                <div class="flex flex-row space-x-3 justify-end">
                    <div>{{ order.status  }}</div>
                </div>
            </template>
        </UCard>
        <div class="flex flex-col justify-center grow"></div>
              <UNavigationMenu class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-white dark:bg-latte-50 drop-shadow-md" :items="[{label: 'Orders', to: `/${route.params.cafeId}/barista`}, {label: 'Menu', to: `/${route.params.cafeId}/barista/menu`}, {label: 'Cafe', to: `/${route.params.cafeId}/barista/cafe`}]" />
    </div>
</template>