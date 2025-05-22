

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
const showNotificationPrompt = ref(true);

// If user is not logged in, redirect to login page
try {
    await account.getSession('current')
} catch (error) {
    navigateTo('/login')
}


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

const requestNotificationPermission = async () => {
    // Manage Push Notifications
    console.log('Requesting permission...');
    const { $firebase } = useNuxtApp()
    Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('Notification permission granted.');
        const messaging = getMessaging($firebase);
        getToken(messaging, {vapidKey: 'BDC1AlTrCJCoxok4zBSOGv_-tUtsHF2upLlBVMIss7Ly_lh-uXgNv43HgMEZnenXMfFeuRmfPwCZQi3uj1riOTY'})
            .then((currentToken) => {
                if (currentToken) {
                    console.log('Token received: ')
                    console.log(currentToken)
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
    addToast({ title: 'Logged out', description: 'You have been logged out', color: 'green' })
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