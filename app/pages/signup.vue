<template>
  <div class="bg-latte min-h-screen flex items-center justify-center p-4">
    <UCard class="w-full sm:max-w-sm bg-white dark:bg-latte-50 ring-1 ring-gray-200 dark:ring-gray-700">
      <template #header>
        <h2 class="text-xl font-bold text-center text-coffee">Create Account</h2>
      </template>

      <UForm :state="state" :schema="schema" @submit="handleSignup" @error="handleError" class="flex flex-col space-y-4">
        <UFormGroup label="Name" name="name" class="mb-4">
          <UInput v-model="state.name" placeholder="Your Name" class="w-full">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-white dark:bg-latte-50 px-1">Your name</span>
            </label>
          </UInput> 
        </UFormGroup>

        <UFormGroup label="Email" name="email" class="mb-4">
          <UInput v-model="state.email" type="email" placeholder="you@example.com" class="w-full">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-white dark:bg-latte-50 px-1">Email</span>
            </label>
          </UInput> 
        </UFormGroup>


        <UFormGroup label="Café ID" name="cafeId" class="mb-4">
          <UInput v-model="state.cafeID" placeholder="Café ID" class="w-full">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-white dark:bg-latte-50 px-1">Your café ID</span>
            </label>
          </UInput> 
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="mb-6">
          <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" :ui="{ trailing: 'pointer-events-auto' }" class="w-full">
            <template #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                :icon="showPassword ? 'i-heroicons-eye-slash-20-solid' : 'i-heroicons-eye-20-solid'"
                :padded="false"
                @click="showPassword = !showPassword"
              />
            </template>
            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-white dark:bg-latte-50 px-1">Password</span>
            </label>
          </UInput> 
        </UFormGroup>
        <div class="hidden" aria-hidden="true">
          <UCheckbox v-model="state.newsletter" label="Subscribe to newsletter" tabindex="-1" />
        </div>

        <UButton type="submit" block :loading="loading" class="bg-coffee-500 hover:bg-coffee-600 text-white">
          Sign Up
        </UButton>
        <p v-if="hasErrors" class="text-red-500 text-sm text-center mt-2">
          {{ hasErrors.errors.map(err => err.message).join(', ') }}
        </p>
      </UForm>

      <template #footer>
        <div class="text-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?
          </span>
          <NuxtLink to="/login" class="text-sm text-coffee-600 hover:underline ml-1 font-medium">
            Log In
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { Query, ID } from 'appwrite';

const { $appwrite } = useNuxtApp();
const account = $appwrite.account;
const databases = $appwrite.databases;
const toast = useToast();
const router = useRouter();

// Form state
const state = reactive({
  name: '',
  email: '',
  password: '',
  cafeID: '',
  newsletter: false
});

// Loading state for the button
const loading = ref(false);
const showPassword = ref(false);
const hasErrors = ref(null as FormErrorEvent | null);

function handleError(error: FormErrorEvent) {
  hasErrors.value = error;
}

function sanitizeCafeID(input: string): string {
  let cafeID = input.toLowerCase().replace(/\s+/g, '');
  cafeID = cafeID.replace(/[^a-z0-9]/g, '');
  cafeID = cafeID.replace(/^-+|-+$/g, '');
  cafeID = cafeID.replace(/-+/g, '-');
  return cafeID.slice(0, 20);
}

// Validation schema using Zod
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  cafeID: z.string().min(3, 'Cafe ID must be at least 3 characters'),
  newsletter: z.boolean().optional()
});

type Schema = z.output<typeof schema>;

// Watch the value of name and update cafeID accordingly "Jean Dupont" -> "jeandupont"
watch(() => state.name, (newName) => {
    state.cafeID = sanitizeCafeID(newName);
});

/**
 * Handles the signup form submission.
 * Creates a new user account using Appwrite.
 */
async function handleSignup(event: FormSubmitEvent<Schema>) {
  hasErrors.value = null;
  loading.value = true;

  // Honeypot check: if the hidden checkbox is checked, fail silently
  if (state.newsletter) {
    setTimeout(() => {
      loading.value = false;
      toast.add({ title: 'Account Created!', description: 'Please login to continue.', color: 'primary' });
      router.push('/login');
    }, 1000);
    return;
  }

  state.cafeID = sanitizeCafeID(state.cafeID);

  // Before creating a new account, verify that the cafeID does not already exsist in the database
  const alreadyExists = await databases.listDocuments('cafe', 'cafe', [Query.equal('$id', state.cafeID)]);
  if (alreadyExists.total > 0) {
    toast.add({ title: 'Cafe ID already exists', description: 'Please choose a different cafe ID.', color: 'error' });
    loading.value = false;
    return;
  }

  try {
    // Use event.data which is validated by the UForm schema
    const { name, email, password } = event.data;

    // Create user using Appwrite SDK
    await account.create(
      ID.unique(), // userId, use unique ID
      email,
      password,
      name
    );

    toast.add({ title: 'Account Created!', description: 'Please login to continue.', color: 'primary' });

    // Create a new email session
    await account.createEmailPasswordSession(email, password);

    // Create a new document in the 'cafes' collection
    // as reported in https://news.ycombinator.com/item?id=46264491#46278464 this piece of code is shit
    await databases.createDocument('cafe', 'cafe', state.cafeID, {
        name: name,
    });

    // Create a default menu item
    await databases.createDocument('cafe', 'item', ID.unique(), {
        name: 'Coffee',
        options: [
            'Size:ristretto;espresso;lungo;americano',
            'Sugar:boolean',
            'Coffein-free:boolean',
            'To go:boolean'
        ],
        cafeId: state.cafeID
    });

    // Save the cafeID in the user's preferences or profile
    await account.updatePrefs({
        cafeID: state.cafeID,
    });

    // Redirect to login page after successful signup
    router.push(`/${state.cafeID}/barista/menu`);

  } catch (error: any) {
    console.error('Signup failed:', error);
    toast.add({ title: 'Signup Failed', description: error.message || 'An unexpected error occurred.', color: 'error' });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>