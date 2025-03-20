<script setup lang="ts">
import { Client, Databases, Query } from 'appwrite'
const runtimeConfig = useRuntimeConfig()
const appconfig = useAppConfig()
const route = useRoute()
const items = ref([] as any[])
const selectedItem = ref(null as any)
const selectedOptions = ref([])
const isOpenOptions = ref(false)

console.log(appconfig)

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

let cafePromise = await databases.getDocument('cafe', 'cafe', route.params.cafeId as string)

itemsPromise.then(function (response) {
    items.value = response.documents
}, function (error) {
    console.log(error);
});

watch(selectedItem, async (newSelectedItem, oldSelectedItem) => {
    if (!newSelectedItem) {
        console.log('selectedItem is null')
        selectedOptions.value = []
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
                value: options === false ? false : options[0]
            }
        }
        return undefined
    });
})

function sendCommand() {
    console.log({
        itemId: selectedItem.value.$id,
        name: selectedItem.value.name,
        options: selectedOptions.value.map(op => ({
            name: op.name,
            value: op.value
        }))})
}

</script>

<template>
    <div class="bg-amber-50 p-8 min-h-screen flex flex-col">
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
            :close="{ onClick: () => isOpenOptions = false }"
            side="bottom" :title="selectedItem?.name">
            <template #body>
                <div
                    v-for="opt of selectedOptions"
                    :key="opt.name"
                    class="mb-4">
                    <div v-if="opt.options === false" class="flex flex-row justify-between">
                        <div>{{ opt.name }}</div>
                        <USwitch v-model="opt.value"></USwitch>
                    </div>
                    <div v-else class="flex flex-col">
                        <div class="flex flex-row justify-between rounded bg-gray-50 p-2">
                            <div
                                v-for="option of opt.options"
                                :key="option"
                                @click="opt.value = option"
                                :class="{'bg-black': opt.value == option, 'text-white': opt.value == option}"
                                class="rounded px-4 cursor-pointer hover:bg-gray-400">
                                    {{ option }}
                            </div>
                        </div>
                    </div>
                </div>
                <UButton class="rounded-full" @click="sendCommand">Commander</UButton>
            </template>
        </USlideover>
    </div>
</template>
