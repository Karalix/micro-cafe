
<template>
  <div class="bg-latte min-h-screen flex items-center justify-center p-4">
    <UCard class="w-full max-w-sm bg-white dark:bg-latte-50 ring-1 ring-gray-200 dark:ring-gray-700">
      <template #header>
        <h2 class="text-xl font-semibold text-center text-coffee">Login</h2>
      </template>

      <UForm :state="state" :schema="schema" @submit="handleLogin" class="flex flex-col space-y-4">
        <UFormGroup label="Email" name="email" class="mb-4">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            required
          >
            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-white dark:bg-latte-50 px-1">Email</span>
            </label>
          </UInput> 
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="mb-6">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
            required
          >
            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-white dark:bg-latte-50 px-1">Password</span>
            </label>
          </UInput> 
        </UFormGroup>

        <UAlert
          v-if="errorMessage"
          icon="i-heroicons-exclamation-triangle"
          color="error"
          variant="soft"
          :title="errorMessage"
          class="mb-4"
        />

        <UButton
          type="submit"
          label="Login"
          block
          :loading="loading"
          :disabled="loading"
          class="bg-coffee-500 hover:bg-coffee-600 text-white"
        />
      </UForm>

      <template #footer>
        <p class="text-sm text-center text-gray-500">
          Don't have an account?
          <NuxtLink to="/signup" class="text-coffee-600 font-medium hover:underline">Sign up</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

import type { FormSubmitEvent } from '@nuxt/ui';

const { $appwrite } = useNuxtApp();
const account = $appwrite.account;
const router = useRouter();
const { add: addToast } = useToast(); // Optional: For success/error notifications

const loading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

// Define form state using reactive
const state = reactive({
  email: '',
  password: '',
});

// Define Zod schema for validation
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type Schema = z.output<typeof schema>

/**
 * Handles the user login process.
 * Attempts to create an email session using Appwrite.
 * Redirects on success, shows error on failure.
 */
async function handleLogin(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  errorMessage.value = null;

  try {
    // Use the validated data from the event
    const { email, password } = event.data;
    console.log('Attempting login with:', email); // Debug log

    // Replace with your Appwrite logic
    await account.createEmailPasswordSession(email, password);

    console.log('Login successful'); // Debug log
    addToast({ title: 'Login Successful!', description: 'Redirecting...', color: 'success' });

    // Get cafeID from preferences
    const preferences = await account.getPrefs();
    const cafeID = preferences.cafeID;
    // Redirect to a protected page, e.g., dashboard
    await router.push(`/${cafeID}/barista`); // Adjust the redirect path as needed

  } catch (error: any) {
    if (error.type === 'user_session_already_exists') {
      // Get cafeID from preferences
      const preferences = await account.getPrefs();
      const cafeID = preferences.cafeID;
      // Redirect to a protected page, e.g., dashboard
      await router.push(`/${cafeID}/barista`); // Adjust the redirect path as needed
    }
    console.error('Login failed:', error); // Debug log
    errorMessage.value = error.message || 'An unexpected error occurred. Please try again.';
    addToast({ title: 'Login Failed', description: errorMessage.value!, color: 'error' });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>