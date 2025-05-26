<script setup lang="ts">
import { Client, Databases, Query, ID, type Models } from 'appwrite'
const runtimeConfig = useRuntimeConfig()
const appconfig = useAppConfig()
const route = useRoute()
const items = ref([] as any[])
const selectedItem = ref(null as any)
const selectedOptions = ref([])
const isOpenOptions = ref(false)
const isOrderSending = ref(false)
const isOrderSent = ref(false)
const orders = ref([] as Array<Models.Document>)
const localSavedOrders = ref([] as Array<Models.Document>)
const clientName = ref('')

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe');
const databases = new Databases(client);

let itemsPromise = databases.listDocuments(
    "cafe",
    "item",
    [
        Query.equal('cafeId', route.params.cafeId as string)
    ]
);
let cafePromise = null as any

try {
    cafePromise  = await databases.getDocument('cafe', 'cafe', route.params.cafeId as string)
} catch (error) {
    console.log(error)
    navigateTo('/invalid-cafe')
}

itemsPromise.then(function (response) {
    items.value = response.documents
}, function (error) {
    console.log(error);
});

watch(selectedItem, async (newSelectedItem, oldSelectedItem) => {
    if (!newSelectedItem) {
        console.log('selectedItem is null')
        selectedOptions.value = []
        return
    }
    selectedOptions.value = newSelectedItem.options.map((element: string) => {
        //console.log(element)
        if (!element) return undefined
        const parse1 = element.split(':')
        if (parse1.length === 2) {
            const name = parse1[0]
            const options = parse1[1] == 'boolean' ? false : parse1[1].split(';')

            return {
                name: name,
                options: options,
                value: options === false ? false : '0'
            }
        }
        return undefined
    }).filter((element: any) => element !== undefined).sort((element: any) => element.options === false ? 1 : -1);
})


onMounted(async () => {
    // get the list of order ids from the localstorage and get the orders from the database
    const ordersIds = localStorage.getItem('orders')

    if (ordersIds) {
        localSavedOrders.value = JSON.parse(ordersIds)
        orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])).documents.filter((order) => localSavedOrders.value.includes(order.$id)).reverse()
    }
    client.subscribe(`databases.cafe.collections.order.documents`, async (response) => {
        if (response.payload.cafeId.$id === route.params.cafeId) {
            orders.value = (await databases.listDocuments('cafe', 'order', [Query.equal('cafeId', route.params.cafeId as string)])).documents.filter((order) => localSavedOrders.value.includes(order.$id)).reverse()
        }
    })
    // get the surname of the customer from the localstorage
    clientName.value = localStorage.getItem('clientName') || ''

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

function sendCommand() {
    isOrderSending.value = true
    // Sauvegarder le nom du client dans le local storage
    localStorage.setItem('clientName', clientName.value)
    const sendOrderPromise = databases.createDocument(
        "cafe",
        "order",
        ID.unique(),
        {
            item: selectedItem.value.$id,
            cafeId: route.params.cafeId as string,
            status: 'ordered',
            clientName: clientName.value || 'Anon',
            options: selectedOptions.value.filter(op => op.value !== false).map(op => `${op.options === false ? op.name : op.options[op.value]}`),
        }
    ).catch(function (error) {
        console.log(error);
        isOrderSending.value = false
    }).then(function (response) {
        console.log(response);
        isOrderSending.value = false
        // Sauvegarder la commande dans le local storage avec la liste des commandes passées
        const orders = localStorage.getItem('orders')
        if (orders) {
            localSavedOrders.value = JSON.parse(orders)
            localSavedOrders.value.push(response.$id)
            localStorage.setItem('orders', JSON.stringify(localSavedOrders.value))
        } else {
            localStorage.setItem('orders', JSON.stringify([response.$id]))
            localSavedOrders.value = [response.$id]
        }
        isOpenOptions.value = false
        selectedItem.value = null
        selectedOptions.value = []
    });
}

</script>

<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">{{ cafePromise.name }}</h1>
        <NuxtLink :to="`/${route.params.cafeId}/barista`">
            <UButton class="fixed top-4 right-4 z-10">
                Vue barista
                <UIcon name="i-hugeicons:coffee-02" />
            </UButton>
        </NuxtLink>
        <div class="flex flex-col justify-center grow">
            <h2 class="font-bold text-2xl mb-4 ml-4 sm:ml-6">Menu</h2>
            <UCard
                v-for="item of items"
                :key="item.$id"
                @click="isOpenOptions = true;selectedItem = item"
                variant="soft"
                class="mb-2 flex flex-row bg-(--ui-bg) drop-shadow-sm rounded-2xl hover:cursor-pointer hover:bg-(--ui-bg-accented) active:drop-shadow-md transition-all">
                <div class="text-(--ui-text)">{{ item.name }}</div>
            </UCard>
            <h2 key="pastOrders" class="font-bold text-2xl mb-4 ml-4 sm:ml-6">Past Orders</h2>
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
            <ULink to="/signup"><UButton>Create an (inoperant) account (for now) to be notified when you can open your own café too</UButton></ULink>
        </div>
        <USlideover
            :open="isOpenOptions"
            :close="{ onClick: () => isOpenOptions = false, color: 'primary' }"
            side="bottom" :title="selectedItem?.name">
            <template #body>
                <div
                    v-for="opt of selectedOptions"
                    :key="opt.name"
                    class="mb-4">
                    <div v-if="opt.options === false" class="flex flex-row justify-between">
                        <div class="text-(--ui-primary)">{{ opt.name }}</div>
                        <USwitch color="primary" v-model="opt.value"></USwitch>
                    </div>
                    <div v-else class="flex flex-col">
                        <UTabs :content="false" :items="opt.options.map(o =>   { return { label: o, slot: o } })" v-model="opt.value" default-value="0"></UTabs>
                    </div>
                </div>
                <UFormField label="Votre nom" class="mt-4">
                    <UInput v-model="clientName" placeholder="Votre nom"></UInput>
                </UFormField>
                <div class="flex flex-row justify-end mt-4">
                    <UButton :loading="isOrderSending" size="xl" class="rounded-full" @click="sendCommand">Commander</UButton>
                </div>
            </template>
        </USlideover>
    </div>
</template>
