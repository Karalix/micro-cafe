<template>
  <div class="pb-16 bg-latte min-h-screen">
        <UContainer class="py-8">
            <UCard class="bg-white dark:bg-latte-50 ring-1 ring-gray-200 dark:ring-gray-700">
            <template #header>
                <h1 class="text-xl font-semibold leading-tight text-coffee">
                Share Your Page
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                Share this page using the URL or QR code below.
                </p>
            </template>

            <div class="space-y-6">
                <UFormGroup
                label="Page URL"
                name="pageUrl"
                help="This is the direct link to your page."
                >
                <div class="flex items-center gap-2">
                    <UInput
                    :model-value="pageUrl"
                    readonly
                    class="flex-grow"
                    placeholder="Generating URL..."
                    icon="i-heroicons-link"
                    size="lg"
                    />
                    <UButton
                    @click="handleCopyUrl"
                    :icon="copied ? 'i-heroicons-check-circle-20-solid' : 'i-heroicons-clipboard-document-20-solid'"
                    :color="copied ? 'success' : 'primary'"
                    variant="solid"
                    square
                    size="lg"
                    :disabled="!pageUrl"
                    >
                    {{ copied ? 'Copied!' : 'Copy' }}
                    </UButton>
                </div>
                </UFormGroup>

                <UDivider />

                <div>
                <h2 class="text-lg font-medium text-coffee mb-2">
                    QR Code
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Scan this QR code with a mobile device to open the page.
                </p>
                <div v-if="pageUrl" class="flex justify-center items-center p-4 bg-white rounded-lg shadow max-w-xs mx-auto border border-gray-100">
                    <ClientOnly>
                    <QrCodeVue
                        :value="pageUrl"
                        :size="220"
                        level="H"
                        render-as="svg"
                        :margin="2"
                    />
                    <template #fallback>
                        <USkeleton class="h-[220px] w-[220px" />
                    </template>
                    </ClientOnly>
                </div>
                <div v-else class="text-center text-gray-500 py-10">
                    <p class="mb-2">Page URL not available, QR code cannot be generated.</p>
                    <USkeleton class="h-[220px] w-[220px mx-auto" />
                </div>
                </div>
            </div>
            </UCard>
        </UContainer>
        <UContainer class="py-8">
            <UCard class="bg-white ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-latte-50">
                <template #header>
                    <h1 class="text-xl font-semibold leading-tight text-coffee">
                        Update Cafe Name
                    </h1>
                    <p class="text-sm text-gray-500">
                        Modify your cafe's name.
                    </p>
                </template>

                <div class="space-y-6">
                    <UFormGroup
                        label="Cafe Name"
                        name="cafeNameUpdate"
                        help="Enter the new name for your cafe."
                    >
                        <div class="flex items-center gap-2">
                            <UInput
                                v-model="cafeNameInput"
                                placeholder="Enter new cafe name"
                                class="flex-grow"
                                icon="i-heroicons-identification-20-solid"
                                size="lg"
                                :disabled="!currentCafeId || isLoadingUpdateName"
                            />
                            <UButton
                                @click="handleUpdateCafeName"
                                :loading="isLoadingUpdateName"
                                :disabled="!cafeNameInput.trim() || !currentCafeId || isLoadingUpdateName"
                                icon="i-heroicons-arrow-path-20-solid"
                                variant="solid"
                                size="lg"
                            >
                                {{ isLoadingUpdateName ? 'Updating...' : 'Update' }}
                            </UButton>
                        </div>
                    </UFormGroup>
                    <!-- Additional cafe settings can be added here -->
                </div>
            </UCard>
        </UContainer>
        <UButton @click="logout" class="mb-10 ml-4 sm:ml-6" color="neutral" variant="outline">Logout</UButton>
        <UNavigationMenu class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-white drop-shadow-md" :items="[{label: 'Orders', to: `/${route.params.cafeId}/barista`}, {label: 'Menu', to: `/${route.params.cafeId}/barista/menu`}, {label: 'Cafe', to: `/${route.params.cafeId}/barista/cafe`}]" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from '#imports' // Nuxt auto-imports route composable
import { useToast } from '#imports' // Nuxt UI auto-imports toast composable
import QrCodeVue from 'qrcode.vue' // Import QR Code component
import { useClipboard } from '@vueuse/core' // For advanced clipboard functionality

const { add: addToast } = useToast(); // Optional: For success/error notifications

const { $appwrite } = useNuxtApp();
const databases = $appwrite.databases;
const account = $appwrite.account;

// Define types for route parameters for better type safety if needed.
// interface CafeRouteParams {
//   cafeId: string | string[];
// }

const route = useRoute()
const toast = useToast()

const currentCafeId = ref<string | undefined>(undefined)

// --- Refs and logic for "Update Cafe Details" ---
const cafeNameInput = ref<string>('')
const isLoadingUpdateName = ref<boolean>(false)

/**
 * Handles the action of updating the cafe's name.
 * This function would typically call an API to persist the change.
 * Provides feedback via toast notifications.
 */
async function handleUpdateCafeName(): Promise<void> {
  if (!currentCafeId.value) {
    toast.add({
      title: 'Error',
      description: 'Cafe ID is not available. Cannot update name.',
      color: 'error',
      icon: 'i-heroicons-x-circle-20-solid',
    })
    return
  }

  if (!cafeNameInput.value.trim()) {
    toast.add({
      title: 'Validation Error',
      description: 'Cafe name cannot be empty.',
      color: 'warning',
      icon: 'i-heroicons-exclamation-circle-20-solid',
    })
    return
  }

  isLoadingUpdateName.value = true
  try {
    await databases.updateDocument('cafe', 'cafe', currentCafeId.value, { name: cafeNameInput.value });

    toast.add({
      title: 'Success!',
      description: `Cafe name updated to "${cafeNameInput.value}".`,
      color: 'primary',
      icon: 'i-heroicons-check-circle-20-solid',
    })
  } catch (error) {
    console.error('Failed to update cafe name:', error)
    toast.add({
      title: 'Update Failed',
      description: 'Could not update cafe name. Please try again.',
      color: 'error',
      icon: 'i-heroicons-x-circle-20-solid',
    })
  } finally {
    isLoadingUpdateName.value = false
  }
}

/**
 * Watches the route parameter 'cafeId' for changes.
 * Updates `currentCafeId` when the route parameter is available or changes.
 * Shows a toast notification if the 'cafeId' is missing, as it's crucial for this page.
 */
watch(
  () => route.params.cafeId,
  (newCafeIdParam) => {
    const id = Array.isArray(newCafeIdParam) ? newCafeIdParam[0] : newCafeIdParam
    if (id && typeof id === 'string') {
      currentCafeId.value = id
    } else {
      currentCafeId.value = undefined
      // Only show toast on client-side after router is ready and if cafeId is truly missing
      if (process.client && route.fullPath !== '/' && route.name) { // Ensure route is resolved
        toast.add({
          title: 'Missing Cafe ID',
          description: 'The unique identifier for the cafe is missing from the URL.',
          color: 'warning',
          icon: 'i-heroicons-exclamation-triangle-20-solid',
        })
      }
    }
  },
  { immediate: true } // Run the watcher immediately on component mount
)

/**
 * Computed property for the full page URL.
 * Constructs the URL based on the `currentCafeId`.
 * Example: https://mytinycafe.com/my-cafe-123
 */
const pageUrl = computed<string>(() => {
  if (currentCafeId.value) {
    // Ensure cafeId is properly encoded if it might contain special characters
    return `https://mytinycafe.com/${encodeURIComponent(currentCafeId.value)}`
  }
  return '' // Return empty string if cafeId is not available
})

// useClipboard composable from @vueuse/core
// `source` is a ref, so it will copy the latest `pageUrl.value`
// `copied` is a ref that becomes true for a short duration after successful copy
const { copy, copied, isSupported: clipboardIsSupported } = useClipboard({
  source: pageUrl,
  legacy: true, // Uses older execCommand based copying if Clipboard API is not available
})

/**
 * Handles the action of copying the page URL to the user's clipboard.
 * Provides feedback via toast notifications.
 */
async function handleCopyUrl(): Promise<void> {
  if (!pageUrl.value) {
    toast.add({
      title: 'URL Not Available',
      description: 'The page URL is not ready to be copied.',
      color: 'warning',
      icon: 'i-heroicons-exclamation-circle-20-solid',
    })
    return
  }

  if (!clipboardIsSupported.value) {
    toast.add({
      title: 'Clipboard Access Denied',
      description: 'Your browser settings prevent clipboard access, or it\'s not supported.',
      color: 'error',
      icon: 'i-heroicons-no-symbol-20-solid',
    })
    // As a fallback, you could select the text in the input for manual copying
    // const inputElement = document.querySelector<HTMLInputElement>('input[name="pageUrl"');
    // inputElement?.select();
    return
  }

  try {
    await copy(pageUrl.value) // Attempt to copy the current URL
    if (copied.value) { // `copied` ref from useClipboard indicates success
      toast.add({
        title: 'URL Copied!',
        description: 'The page URL has been copied to your clipboard.',
        color: 'primary',
        icon: 'i-heroicons-check-circle-20-solid',
      })
    } else {
      // This might occur if copy() promise resolves but `copied` flag isn't set (e.g. legacy mode issues)
      toast.add({
        title: 'Copy Unconfirmed',
        description: 'Attempted to copy. Please verify your clipboard.',
        color: 'primary',
        icon: 'i-heroicons-information-circle-20-solid',
      })
    }
  } catch (error) {
    console.error('Failed to copy URL:', error)
    toast.add({
      title: 'Copy Failed',
      description: 'An error occurred while trying to copy the URL. Please copy it manually.',
      color: 'error',
      icon: 'i-heroicons-x-circle-20-solid',
    })
  }
}


const logout = async () => {
    await account.deleteSession('current')
    navigateTo('/')
    addToast({ title: 'Logged out', description: 'You have been logged out', color: 'primary' })
}

// Nuxt UI components like UPage, UCard, UInput, UButton, etc.,
// and composables like useRoute, useToast are auto-imported by Nuxt.
// Ensure 'qrcode.vue' and '@vueuse/core' are installed in your project:
// `npm install qrcode.vue @vueuse/core` or `yarn add qrcode.vue @vueuse/core`
</script>

<style scoped>
/* Scoped styles for this page component */
.dark .dark\:bg-gray-50 {
  /* Specific override if needed for QR code background in dark mode, qrcode.vue usually handles this well with SVG */
   background-color: #F9FAFB; /* Tailwind gray-50 */
}
</style>