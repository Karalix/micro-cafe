<script setup lang="ts">
import { Client, Databases, Query, ID, type Models } from 'appwrite'
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
    cafeId: CafeDocument; // Based on example, cafeId is populated on read
}

const route = useRoute()
const toast = useToast()
const items = ref<ItemDocument[]>([])
const cafe = ref<CafeDocument | null>(null)
const isLoadingCafe = ref(true)
const isLoadingItems = ref(true)

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe'); // Replace with your project ID
const databases = new Databases(client);

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const currentItemId = ref<string | null>(null)
const currentItemName = ref('')
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
        name: currentItemName.value.trim(),
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

</script>
<template>
    <UContainer class="py-8">
        <div v-if="isLoadingCafe" class="mb-6">
            <USkeleton class="h-10 w-3/4 mb-2" />
            <USkeleton class="h-6 w-1/4" />
        </div>
        <div v-else-if="cafe" class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
                Manage Menu for {{ cafe.name }}
            </h1>
            <p class="text-md text-gray-600 dark:text-gray-400">Cafe ID: {{ cafe.$id }}</p>
        </div>

        <UButton @click="openAddItemModal" icon="i-heroicons-plus-circle-20-solid" label="Add New Item" class="mb-8"
            size="lg" />

        <div v-if="isLoadingItems && items.length === 0" class="space-y-4">
            <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
        </div>
        <div v-else-if="!items || items.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-12">
            <UIcon name="i-heroicons-clipboard-document-list"
                class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h3 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No items yet</h3>
            <p class="mt-2 text-md">Get started by adding a new menu item.</p>
        </div>

        <ul v-else class="space-y-6">
            <li v-for="item in items" :key="item.$id">
                <UCard>
                    <template #header>
                        <div class="flex justify-between items-center">
                            <h2 class="text-2xl font-semibold text-primary-600 dark:text-primary-400 truncate"
                                :title="item.name">
                                {{ item.name }}
                            </h2>
                        </div>
                    </template>

                    <div v-if="item.options && item.options.length > 0">
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Options:</p>
                        <ul class="list-disc list-inside pl-1 text-gray-700 dark:text-gray-300 space-y-1">
                            <li v-for="(option, index) in item.options" :key="index" class="truncate text-sm"
                                :title="option">
                                {{ option }}
                            </li>
                        </ul>
                    </div>
                    <p v-else class="text-sm text-gray-500 dark:text-gray-400 italic">No specific options defined.</p>

                    <template #footer>
                        <div class="flex justify-end space-x-3">
                            <UButton @click="openEditItemModal(item)" label="Edit"
                                icon="i-heroicons-pencil-square-20-solid" variant="outline" />
                            <UButton @click="handleDeleteItem(item.$id)" label="Delete"
                                icon="i-heroicons-trash-20-solid" color="error" variant="solid" />
                        </div>
                    </template>
                </UCard>
            </li>
        </ul>

        <!-- Modal for Add/Edit Item -->
        <USlideover :open="showModal" @close="showModal = false" side="bottom">
            <!-- Removed :close attribute for explicit button -->
            <!-- Added @close to handle closing via ESC or overlay click -->
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                            {{ isEditing ? 'Edit Item' : 'Add New Item' }}
                        </h3>
                        <UButton color="primary" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                            @click="showModal = false" />
                    </div>
                </template>
                <template #body>
                    <UInput v-model="currentItemName" placeholder="e.g., Espresso, Croissant" />
                        <div class="space-y-4 mt-2">
                            <div v-for="(option, index) in currentStructuredOptions" :key="option.id"
                                class="p-3 border border-gray-200 dark:border-gray-700 rounded-md space-y-3 bg-gray-50 dark:bg-gray-800/50">
                                <div class="flex items-center space-x-2">
                                        <UInput v-model="option.name" placeholder="e.g., Size, Milk, Decaf" class="w-1/3" required/>
                                        <USwitch v-model="option.isBoolean"/>
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
                                                placeholder="e.g., Small, Large, Oat Milk" />
                                        <UButton icon="i-heroicons-minus-circle-20-solid" color="error" variant="link"
                                            @click="removeValueFromOptionList(index, valueIndex)"
                                            aria-label="Remove value" />
                                    </div>
                                    <UButton label="Add Value" icon="i-heroicons-plus-circle-16-solid" size="xs"
                                        variant="outline" @click="addValueToOptionList(index)"
                                        :disabled="!option.name.trim()" />
                                </div>
                            </div>
                            <UButton label="Add New Option Type" icon="i-heroicons-plus-20-solid" variant="outline"
                                @click="addNewStructuredOption" />
                        </div>
                </template>
                <template #footer>
                    <div class="flex justify-end space-x-3">
                        <UButton label="Cancel" color="primary" variant="outline" @click="showModal = false" />
                        <UButton type="submit" :label="isEditing ? 'Save Changes' : 'Add Item'"
                            @click="handleSaveItem" />
                    </div>
                </template>
        </USlideover>

        <!-- Toaster for notifications -->
        <UNotifications />
              <UNavigationMenu class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-(--ui-bg) drop-shadow-md" :items="[{label: 'Orders', to: `/${route.params.cafeId}/barista`}, {label: 'Menu', to: `/${route.params.cafeId}/barista/menu`}, {label: 'Cafe', to: `/${route.params.cafeId}/barista/cafe`}]" />

    </UContainer>
</template>
