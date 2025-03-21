<script setup lang="ts">
import { Client, Databases, Query, ID } from 'appwrite'
const runtimeConfig = useRuntimeConfig()
const appconfig = useAppConfig()
const route = useRoute()
const items = ref([] as any[])
const selectedItem = ref(null as any)
const selectedOptions = ref([])
const isOpenOptions = ref(false)
const isOrderSending = ref(false)
const isOrderSent = ref(false)

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe');
const databases = new Databases(client);

let itemsPromise = databases.listDocuments(
    "cafe",
    "item",
    [
        Query.equal('cafeId', 'alix')
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
        console.log(element)
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
    });
})

function sendCommand() {
    isOrderSending.value = true
    const sendOrderPromise = databases.createDocument(
        "cafe",
        "order",
        ID.unique(),
        {
            item: selectedItem.value.$id,
            cafeId: route.params.cafeId as string,
            status: 'ordered',
            clientName: 'Anon',
            options: selectedOptions.value.filter(op => op.value !== false).map(op => `${op.options === false ? op.name : op.options[op.value]}`),
        }
    ).catch(function (error) {
        console.log(error);
        isOrderSending.value = false
    }).then(function (response) {
        console.log(response);
        isOrderSending.value = false
        navigateTo(`/${route.params.cafeId}/order/${response.$id}`)
        selectedItem.value = null
        selectedOptions.value = []
    });
}

</script>

<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">{{ cafePromise.name }}</h1>
        <div class="flex flex-col justify-center grow">
            <h2 class="font-bold text-2xl mb-4 ml-4 sm:ml-6">Menu</h2>
            <UCard
                v-for="item of items"
                :key="item.$id"
                @click="isOpenOptions = true;selectedItem = item"
                variant="soft"
                class="flex flex-row bg-white drop-shadow-xl rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
                <div>{{ item.name }}</div>
            </UCard>
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
                <UButton :loading="isOrderSending" size="xl" class="rounded-full" @click="sendCommand">Commander</UButton>
            </template>
        </USlideover>
    </div>
</template>
