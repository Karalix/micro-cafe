<script setup lang="ts">
import { Account, Client, Databases, Query, ID, type Models, Messaging } from 'appwrite'
import { getMessaging, getToken } from "firebase/messaging";

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe');
const databases = new Databases(client);
const account = new Account(client);
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


orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string), Query.equal('status', 'ordered')])).documents
pastOrders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string), Query.notEqual('status', 'ordered')])).documents.slice(0, 3)

onMounted(async () => {
    client.subscribe(`databases.cafe.collections.order.documents`, async (response) => {
        // Assert the type of response.payload to your defined interface
        const payload = response.payload as OrderPayload;

        // Now you can safely access properties defined in OrderPayload.
        // It's also a good practice to check for the existence of nested objects
        // before accessing their properties, if they can be optional.
        if (payload && payload.cafeId && payload.cafeId.$id === route.params.cafeId) {
            orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string), Query.equal('status', 'ordered')])).documents;
            pastOrders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string), Query.notEqual('status', 'ordered')])).documents.slice(0, 3);
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
}

const cancelOrder = async (orderId: string) => {
    await databases.updateDocument('cafe', 'order', orderId, {
        status: 'canceled'
    })
}

const logout = async () => {
    await account.deleteSession('current')
    navigateTo('/')
    addToast({ title: 'Logged out', description: 'You have been logged out', color: 'primary' })
}
</script>


<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">Order</h1>
        <UButton @click="logout" class="mb-4 ml-4 sm:ml-6">Logout</UButton>
        <UButton v-if="showNotificationPrompt" @click="requestNotificationPermission" class="mb-4 ml-4 sm:ml-6">Request Notification Permission</UButton>
        <div class="flex flex-col justify-center grow"></div>
        <UCard
           variant="soft"
           v-for="order in orders"
           :key="order.$id"
           class="mb-4 text-(--ui-text) bg-(--ui-bg) drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-gray-200 active:drop-shadow-md transition-all">
            <div>{{ order.item?.name || 'Unknown item' }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
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
            class="mb-4 text-(--ui-text) bg-(--ui-bg) drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-gray-200 active:drop-shadow-md transition-all">
            <div>{{ order.item.name || 'Unknown item'  }} - {{ order.clientName }} - {{ order.options.join(', ') }}</div>
            <template #footer>
                <div class="flex flex-row space-x-3 justify-end">
                    <div>{{ order.status  }}</div>
                </div>
            </template>
        </UCard>
        <div class="flex flex-col justify-center grow"></div>
              <UNavigationMenu class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-(--ui-bg) drop-shadow-md" :items="[{label: 'Orders', to: `/${route.params.cafeId}/barista`}, {label: 'Menu', to: `/${route.params.cafeId}/barista/menu`}, {label: 'Cafe', to: `/${route.params.cafeId}/barista/cafe`}]" />
    </div>
</template>