<template>
  <div>
      <UContainer class="py-8">
        <UCard>
          <template #header>
            <h1 class="text-xl font-semibold leading-tight">
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
                  :color="copied ? 'green' : 'primary'"
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
              <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                QR Code
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Scan this QR code with a mobile device to open the page.
              </p>
              <div v-if="pageUrl" class="flex justify-center items-center p-4 bg-white dark:bg-gray-50 rounded-lg shadow max-w-xs mx-auto">
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
              <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
                <p class="mb-2">Page URL not available, QR code cannot be generated.</p>
                <USkeleton class="h-[220px] w-[220px mx-auto" />
              </div>
            </div>
          </div>

          <template #footer>
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
              Ensure your device has internet access to open the page.
            </p>
          </template>
        </UCard>
      </UContainer>
              <UNavigationMenu class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-(--ui-bg) drop-shadow-md" :items="[{label: 'Orders', to: `/${route.params.cafeId}/barista`}, {label: 'Menu', to: `/${route.params.cafeId}/barista/menu`}, {label: 'Cafe', to: `/${route.params.cafeId}/barista/cafe`}]" />

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from '#imports' // Nuxt auto-imports route composable
import { useToast } from '#imports' // Nuxt UI auto-imports toast composable
import QrCodeVue from 'qrcode.vue' // Import QR Code component
import { useClipboard } from '@vueuse/core' // For advanced clipboard functionality

// Define types for route parameters for better type safety if needed.
// interface CafeRouteParams {
//   cafeId: string | string[];
// }

const route = useRoute()
const toast = useToast()

const currentCafeId = ref<string | undefined>(undefined)

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
          color: 'orange',
          icon: 'i-heroicons-exclamation-triangle-20-solid',
          timeout: 5000,
        })
      }
    }
  },
  { immediate: true } // Run the watcher immediately on component mount
)

/**
 * Computed property for the full page URL.
 * Constructs the URL based on the `currentCafeId`.
 * Example: https://micro-cafe.nuxt.dev/my-cafe-123
 */
const pageUrl = computed<string>(() => {
  if (currentCafeId.value) {
    // Ensure cafeId is properly encoded if it might contain special characters
    return `https://micro-cafe.nuxt.dev/${encodeURIComponent(currentCafeId.value)}`
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
      color: 'yellow',
      icon: 'i-heroicons-exclamation-circle-20-solid',
    })
    return
  }

  if (!clipboardIsSupported.value) {
    toast.add({
      title: 'Clipboard Access Denied',
      description: 'Your browser settings prevent clipboard access, or it\'s not supported.',
      color: 'red',
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
        color: 'green',
        icon: 'i-heroicons-check-circle-20-solid',
      })
    } else {
      // This might occur if copy() promise resolves but `copied` flag isn't set (e.g. legacy mode issues)
      toast.add({
        title: 'Copy Unconfirmed',
        description: 'Attempted to copy. Please verify your clipboard.',
        color: 'blue',
        icon: 'i-heroicons-information-circle-20-solid',
      })
    }
  } catch (error) {
    console.error('Failed to copy URL:', error)
    toast.add({
      title: 'Copy Failed',
      description: 'An error occurred while trying to copy the URL. Please copy it manually.',
      color: 'red',
      icon: 'i-heroicons-x-circle-20-solid',
    })
  }
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