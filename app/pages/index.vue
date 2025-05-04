<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome to Cafe Explorer
        </h1>
      </template>

      <div class="space-y-6">
        <!-- Go to Cafe Section -->
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Find a Cafe
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Enter the Cafe ID to view its details.
          </p>
          <UFormGroup label="Cafe ID" name="cafeId">
            <UInput
              v-model="cafeId"
              placeholder="Enter Cafe ID"
              icon="i-heroicons-building-storefront"
              size="lg"
              @keyup.enter="goToCafe"
            />
          </UFormGroup>
          <UButton
            label="Go to Cafe"
            block
            size="lg"
            :disabled="!cafeId"
            @click="goToCafe"
          />
        </div>

        <UDivider label="OR" />

        <!-- Login Section -->
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Account Access
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Login to manage your cafes or profile.
          </p>
          <UButton
            label="Login"
            color="primary"
            variant="solid"
            block
            size="lg"
            icon="i-heroicons-arrow-right-on-rectangle"
            @click="goToLogin"
          />
          <!-- Add Register button if needed -->
          <!--
          <UButton
            label="Register"
            color="primary"
            variant="outline"
            block
            size="lg"
            icon="i-heroicons-user-plus"
            @click="goToRegister"
          />
          -->
        </div>
      </div>

      <template #footer>
        <p class="text-xs text-center text-gray-500 dark:text-gray-400">
          Powered by Nuxt & Appwrite
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#app' // Use '#app' for Nuxt 3 auto-imports

/**
 * Ref for storing the entered Cafe ID.
 * @type {import('vue').Ref<string>}
 */
const cafeId = ref<string>('')

/**
 * Nuxt router instance.
 * @type {import('vue-router').Router}
 */
const router = useRouter()

/**
 * Navigates to the specific cafe page based on the entered ID.
 * @returns {Promise<void>}
 */
const goToCafe = async (): Promise<void> => {
  if (cafeId.value && cafeId.value.trim() !== '') {
    try {
      await router.push(`/${cafeId.value.trim()}`)
    } catch (error) {
      console.error('Navigation error:', error)
      // Optionally, show an error message to the user
      // e.g., using useToast() from Nuxt UI
    }
  } else {
    // Optionally, provide feedback if the ID is empty
    console.warn('Cafe ID cannot be empty.')
  }
}

/**
 * Navigates to the login page.
 * @returns {Promise<void>}
 */
const goToLogin = async (): Promise<void> => {
  try {
    await router.push('/login') // Assuming your login page route is '/login'
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

/**
 * Navigates to the registration page (optional).
 * @returns {Promise<void>}
 */
/*
const goToRegister = async (): Promise<void> => {
  try {
    await router.push('/register') // Assuming your register page route is '/register'
  } catch (error) {
    console.error('Navigation error:', error)
  }
}
*/

// Define page meta if needed (e.g., layout)
// definePageMeta({
//   layout: 'public', // Example: If you have a specific layout for public pages
//   auth: false // Example: If using Nuxt Auth module to mark as public
// })
</script>

<style scoped>
/* Add any specific scoped styles here if needed */
</style>