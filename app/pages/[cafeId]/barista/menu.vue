<script setup lang="ts">
import { Query, ID, type Models } from 'appwrite'
import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#imports' // Using #imports for Nuxt 3 auto-imports

// Define types for Appwrite documents
interface CafeDocument extends Models.Document {
    name: string;
    logo?: string | null;
}

interface ItemDocument extends Models.Document {
    name: string;
    options: string[];
    price?: string;
    description?: string;
    cafeId: CafeDocument; // Based on example, cafeId is populated on read
}

const route = useRoute()
const toast = useToast()
const items = ref<ItemDocument[]>([])
const cafe = ref<CafeDocument | null>(null)
const isLoadingCafe = ref(true)
const isLoadingItems = ref(true)

const { $appwrite } = useNuxtApp()
const databases = $appwrite.databases

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const currentItemId = ref<string | null>(null)
const currentItemName = ref('')
const currentItemPrice = ref('')
const currentItemDescription = ref('')
const currentItemOptions = ref('') // Textarea content, newline separated
const currentStructuredOptions = ref([] as {id: string, name: string, isBoolean: boolean, values: {id: string, name: string}[] | false }[])
/**
 * Fetches cafe details.
 */
const fetchCafeDetails = async (cafeId: string): Promise<void> => {
    isLoadingCafe.value = true;
    try {
        cafe.value = await databases.getDocument<CafeDocument>('cafe', 'cafe', cafeId);
    } catch (error) {
        console.error("Failed to fetch cafe:", error);
        toast.add({ title: 'Error Loading Cafe', description: 'The requested cafe could not be found or loaded.', color: 'error', icon: 'i-heroicons-exclamation-triangle' });
        navigateTo('/invalid-cafe');
    } finally {
        isLoadingCafe.value = false;
    }
}
/**
 * Fetches the list of menu items for the current cafe.
 */
const fetchItems = async (): Promise<void> => {
    const cafeIdParam = route.params.cafeId as string;
    if (!cafeIdParam) {
        items.value = [];
        return;
    }

    isLoadingItems.value = true;
    try {
        const response = await databases.listDocuments<ItemDocument>(
            "cafe", // databaseId
            "item", // collectionId
            [Query.equal('cafeId', cafeIdParam)] // Assumes 'cafeId' field stores the string ID for querying
        );
        items.value = response.documents;
    } catch (error) {
        console.error("Failed to fetch items:", error);
        toast.add({ title: 'Error Loading Menu', description: 'Could not load menu items.', color: 'error', icon: 'i-heroicons-exclamation-circle' });
        items.value = []; // Clear items on error
    } finally {
        isLoadingItems.value = false;
    }
};

onMounted(async () => {
    const cafeIdParam = route.params.cafeId as string;
    if (!cafeIdParam) {
        console.error("Cafe ID is missing in route params.");
        toast.add({ title: 'Error', description: 'Cafe ID is missing.', color: 'error' });
        navigateTo('/invalid-cafe'); // Or some other error page
        return;
    }
    await fetchCafeDetails(cafeIdParam);
    // Only fetch items if cafe details were successfully loaded (or if you want to fetch them regardless)
    if (cafe.value) {
        await fetchItems();
    }
});


/**
 * Opens the modal in 'add new item' mode.
 */
const openAddItemModal = (): void => {
    isEditing.value = false;
    currentItemId.value = null;
    currentItemName.value = '';
    currentItemPrice.value = '';
    currentItemDescription.value = '';
    currentItemOptions.value = '';
    currentStructuredOptions.value = [{id: '', name: '', isBoolean: true, values: false}];
    showModal.value = true;
};

/**
 * Opens the modal in 'edit item' mode.
 * @param {ItemDocument} item - The item object to edit.
 */
const openEditItemModal = (item: ItemDocument): void => {
    isEditing.value = true;
    currentItemId.value = item.$id;
    currentItemPrice.value = item.price || '';
    currentItemDescription.value = item.description || '';
    currentItemName.value = item.name || '';
    currentItemOptions.value = (Array.isArray(item.options) ? item.options.join('\n') : '');
    currentStructuredOptions.value = item.options.map((opt: string) => {
        const name = opt.split(':')[0] || '';
        const tmpValues = opt.split(':')[1]
        let values = null as unknown as { id: string, name: string }[] | false;
        if(tmpValues == undefined) {
            values = false;
            return {id: name, name, isBoolean: true, values: false };
        } else if (tmpValues === 'boolean') {
            return {id: name, name, isBoolean: true, values: false };
        } else {
            values = tmpValues.split(';').map(o => ({ id: o, name: o }));
            return {id: name, name, isBoolean: false, values: values };
        }
    });
    showModal.value = true;
};
            

const addNewStructuredOption = (): void => {
    currentStructuredOptions.value.push({id: '', name: '', isBoolean: true, values: false });
};

const removeStructuredOption = (index: number): void => {
    if (currentStructuredOptions.value.length > 1) {// Ensure at least one option remains
        currentStructuredOptions.value.splice(index, 1);
    } else {
        // Reset the only remaining option
        currentStructuredOptions.value[0] = {id: '', name: '', isBoolean: true, values: false };
    }
};

const removeValueFromOptionList = (optionIndex: number, valueIndex: number): void => {
    const currentOption = currentStructuredOptions.value[optionIndex];
    if(currentOption != undefined &&  Array.isArray(currentOption.values)) {
        if (Array.isArray(currentOption.values)) {
            currentOption.values.splice(valueIndex, 1);
            if (currentOption.values.length === 0) {
                currentOption.isBoolean = true;
                currentOption.values = false;
            }
        }
    }
}

const addValueToOptionList = (optionIndex: number): void => {
    const currentOption = currentStructuredOptions.value[optionIndex]
    if (currentOption == undefined) return
    if(Array.isArray(currentOption.values)) {
        currentOption.values.push({ id: '', name: '' });
        currentOption.isBoolean = false;
    } else {
        currentOption.values = [{ id: '', name: '' }];
    }
}
/**
 * Handles the deletion of a menu item.
 * @param {string} itemId - The ID of the item to delete.
 */
const handleDeleteItem = async (itemId: string): Promise<void> => {
    // Consider using a Nuxt UI modal for confirmation for better UX
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        return;
    }
    try {
        await databases.deleteDocument('cafe', 'item', itemId);
        toast.add({ title: 'Item Deleted', description: 'The item has been successfully deleted.', color: 'primary', icon: 'i-heroicons-check-circle' });
        await fetchItems(); // Refresh the list
    } catch (error: any) {
        console.error("Failed to delete item:", error);
        toast.add({ title: 'Deletion Failed', description: error.message || 'Could not delete the item.', color: 'error', icon: 'i-heroicons-x-circle' });
    }
};


/**
 * Handles saving an item (new or existing).
 */
const handleSaveItem = async (): Promise<void> => {
    if (!currentItemName.value.trim()) {
        toast.add({ title: 'Validation Error', description: 'Item name is required.', color: 'warning', icon: 'i-heroicons-exclamation-circle' });
        return;
    }

    const optionsArray = currentStructuredOptions.value.map(opt => {
        const name = opt.name.trim();
        const  options = opt.values ? opt.values.map(o => o.name.trim().replace(/\n/g, ';')).join(';') : 'boolean';
        return `${name}:${options}`;
    })

    // Data to be sent to Appwrite. cafeId must be a string ID.
    const itemData = {
        description: currentItemDescription.value.trim(),
        name: currentItemName.value.trim(),
        price: currentItemPrice.value.trim(),
        options: optionsArray,
        cafeId: route.params.cafeId as string,
    };

    try {
        if (isEditing.value && currentItemId.value) {
            await databases.updateDocument('cafe', 'item', currentItemId.value, itemData);
            toast.add({ title: 'Item Updated', description: 'Changes saved successfully.', color: 'primary', icon: 'i-heroicons-check-circle' });
        } else {
            await databases.createDocument('cafe', 'item', ID.unique(), itemData);
            toast.add({ title: 'Item Added', description: 'New item added to the menu.', color: 'primary', icon: 'i-heroicons-check-circle' });
        }
        await fetchItems();
        showModal.value = false; // Close modal
    } catch (error: any) {
        console.error("Failed to save item:", error);
        toast.add({ title: 'Save Failed', description: error.message || 'Could not save the item.', color: 'error', icon: 'i-heroicons-x-circle' });
    }
};

const parseOption = (optionString: string) => {
    const [name, values] = optionString.split(':');
    if (values === 'boolean') {
        return { name, type: 'boolean', values: [] };
    }
    return { name, type: 'select', values: values ? values.split(';') : [] };
}

</script>
<template>
    <div class="bg-latte min-h-screen">
    <UContainer class="py-8 pb-28">
        <div v-if="isLoadingCafe" class="mb-6">
            <USkeleton class="h-10 w-3/4 mb-2" />
            <USkeleton class="h-6 w-1/4" />
        </div>
        <div v-else-if="cafe" class="mb-8">
            <h1 class="text-4xl font-bold text-coffee">
                Manage Menu for {{ cafe.name }}
            </h1>
            <p class="text-md text-gray-600 dark:text-gray-400">Cafe ID: {{ cafe.$id }}</p>
        </div>

        <UButton @click="openAddItemModal" icon="i-heroicons-plus-circle-20-solid" label="Add New Item" class="mb-8 bg-coffee-500 hover:bg-coffee-600 text-white"
            size="lg" />

        <div v-if="isLoadingItems && items.length === 0" class="space-y-4">
            <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
        </div>
        <div v-else-if="!items || items.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-12">
            <UIcon name="i-heroicons-clipboard-document-list"
                class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h3 class="mt-4 text-xl font-semibold text-coffee">No items yet</h3>
            <p class="mt-2 text-md">Get started by adding a new menu item.</p>
        </div>

        <ul v-else class="space-y-6">
            <li v-for="item in items" :key="item.$id">
                <UCard class="bg-white dark:bg-latte-50 ring-1 ring-gray-200 dark:ring-gray-700">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <h2 class="text-2xl font-semibold text-coffee truncate">
                                {{ item.name }}
                            </h2>
                            <span v-if="item.price" class="text-lg font-bold text-coffee-600">{{ item.price }}</span>
                        </div>
                    </template>
                    <p v-if="item.description" class="text-sm text-gray-600 dark:text-gray-400 my-4">{{ item.description }}</p>
                    <div v-if="item.options && item.options.length > 0">
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Options:</p>
                        <div class="space-y-2">
                            <div v-for="(optionStr, index) in item.options" :key="index" class="text-sm text-gray-700 dark:text-gray-300">
                                <div v-if="parseOption(optionStr).type === 'boolean'" class="flex items-center gap-2">
                                    <span class="font-medium">{{ parseOption(optionStr).name }}</span>
                                    <span class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                                        Yes / No
                                    </span>
                                </div>
                                <div v-else class="flex flex-wrap items-center gap-1.5">
                                    <span class="font-medium mr-1">{{ parseOption(optionStr).name }}:</span>
                                    <span v-for="val in parseOption(optionStr).values" :key="val" 
                                        class="text-xs bg-latte-100 dark:bg-latte-200 text-coffee px-2 py-1 rounded-md border border-latte-200 dark:border-gray-600">
                                        {{ val }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-sm text-gray-500 dark:text-gray-400 italic">No specific options defined.</p>

                    <template #footer>
                        <div class="flex justify-end space-x-3">
                            <UButton @click="openEditItemModal(item)" label="Edit"
                                icon="i-heroicons-pencil-square-20-solid" variant="outline" class="text-coffee border-coffee hover:bg-latte-100" />
                            <UButton @click="handleDeleteItem(item.$id)" label="Delete"
                                icon="i-heroicons-trash-20-solid" color="error" variant="ghost" />
                        </div>
                    </template>
                </UCard>
            </li>
        </ul>

        <!-- Modal for Add/Edit Item -->
        <USlideover :open="showModal" @close="showModal = false" side="bottom" :ui="{ background: 'bg-white dark:bg-latte-50', overlay: { background: 'bg-coffee/50' } }">
            <template #content>
            <div class="p-4 flex-1 overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-semibold leading-6 text-coffee">
                            {{ isEditing ? `Edit ${currentItemName}` : 'Add New Item' }}
                        </h3>
                        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                            @click="showModal = false" />
                    </div>
                    <div>
                        <div class="flex flex-row">
                            <UInput v-model="currentItemName" placeholder="e.g., Espresso, Croissant" class="mb-4 mr-4">
                                <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                                    <span class="inline-flex bg-white dark:bg-latte-50 px-1">Item name</span>
                                </label>
                            </UInput>
                            <UInput v-model="currentItemPrice" placeholder="e.g., 3.50" class="mb-4">
                                <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                                    <span class="inline-flex bg-white dark:bg-latte-50 px-1">Price</span>
                                </label>
                            </UInput>
                        </div>
                        <UTextarea v-model="currentItemDescription" placeholder="Item description..." class="mb-4" autoresize>
                            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                                <span class="inline-flex bg-white dark:bg-latte-50 px-1">Description</span>
                            </label>
                        </UTextarea>
                    </div>
                        <div class="space-y-4 mt-2">
                            <div v-for="(option, index) in currentStructuredOptions" :key="option.id"
                                class="p-3 border border-gray-200 dark:border-latte-100 rounded-md space-y-3 bg-gray-50 dark:bg-latte-50">
                                <div class="flex flex-col items-start space-y-2 space-x-2">
                                        <UInput v-model="option.name" placeholder="e.g., Size, Milk, Decaf" class="w-1/3" required>
                                            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                                                <span class="inline-flex bg-gray-50 dark:bg-latte-100 px-1">Option name</span>
                                            </label>
                                        </UInput>
                                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300"> Multiple Values / Simple option</p>
                                        <USwitch v-model="option.isBoolean" color="primary"/>
                                    <UButton icon="i-heroicons-x-mark-20-solid" color="error" variant="soft"
                                        @click="removeStructuredOption(index)" class="self-end mb-1.5"
                                        aria-label="Remove option" />
                                </div>

                                <div v-if="Array.isArray(option.values) && !option.isBoolean" class="pl-2 space-y-2">
                                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Values for {{
                                        option.name || 'this option' }}:</p>
                                    <div v-for="(valueItem, valueIndex) in option.values" :key="valueItem.id"
                                        class="flex items-center space-x-2">
                                            <UInput v-model="valueItem.name"
                                                placeholder="e.g., Small, Large, Oat Milk">
                                                <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                                                    <span class="inline-flex bg-gray-50 dark:bg-latte-100 px-1">Value</span>
                                                </label>
                                            </UInput>
                                        <UButton icon="i-heroicons-minus-circle-20-solid" color="error" variant="link"
                                            @click="removeValueFromOptionList(index, valueIndex)"
                                            aria-label="Remove value" />
                                    </div>
                                </div>
                                <UButton v-if="!option.isBoolean" label="Add Value" icon="i-heroicons-plus-circle-16-solid" size="xs"
                                    variant="outline" @click="addValueToOptionList(index)"
                                    :disabled="!option.name.trim()" />
                            </div>
                            <UButton label="Add New Option Type" icon="i-heroicons-plus-20-solid" variant="outline"
                                @click="addNewStructuredOption" />
                        </div>
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black flex justify-end space-x-3">
                <UButton label="Cancel" color="neutral" variant="outline" @click="showModal = false" />
                <UButton type="submit" :label="isEditing ? 'Save Changes' : 'Add Item'"
                    class="bg-coffee-500 hover:bg-coffee-600 text-white" @click="handleSaveItem" />
            </div>
            </template>
        </USlideover>

        <!-- Toaster for notifications -->
        <UNotifications />
              <UNavigationMenu class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-white dark:bg-latte-50 drop-shadow-md" :items="[{label: 'Orders', to: `/${route.params.cafeId}/barista`}, {label: 'Menu', to: `/${route.params.cafeId}/barista/menu`}, {label: 'Cafe', to: `/${route.params.cafeId}/barista/cafe`}]" />

    </UContainer>
    </div>
</template>
