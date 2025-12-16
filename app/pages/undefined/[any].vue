<template>
  <div class="bg-latte min-h-screen flex items-center justify-center p-4">
    <UCard class="w-full sm:max-w-sm bg-white dark:bg-latte-50 ring-1 ring-gray-200 dark:ring-gray-700">
      <template #header>
        <h2 class="text-xl font-bold text-center text-coffee">Complete Cafe Setup</h2>
      </template>

      <div class="mb-6 text-sm text-gray-600 dark:text-gray-400 text-center">
        It seems something went wrong during the setup of your cafe. Please provide your cafe details to continue.
      </div>

      <UForm :state="state" :schema="schema" @submit="handleSetup" @error="handleError" class="flex flex-col space-y-4">
        <UFormGroup label="Cafe Name" name="name" class="mb-4">
          <UInput v-model="state.name" placeholder="My Awesome Cafe" class="w-full">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-white dark:bg-latte-50 px-1">Cafe Name</span>
            </label>
          </UInput>
        </UFormGroup>
        <p>Your café name cannot contain special characters or spaces.</p>
        <UFormGroup label="Café ID" name="cafeId" class="mb-4">
          <UInput v-model="state.cafeID" placeholder="cafe-id" class="w-full">
            <label class="pointer-events-none absolute left-0 -top-2.5 text-coffee text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-coffee peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-white dark:bg-latte-50 px-1">Your café ID</span>
            </label>
          </UInput>
        </UFormGroup>

        <UButton type="submit" block :loading="loading" class="bg-coffee-500 hover:bg-coffee-600 text-white">
          Complete Setup
        </UButton>
        <p v-if="hasErrors" class="text-red-500 text-sm text-center mt-2">
          {{ hasErrors.errors.map(err => err.message).join(', ') }}
        </p>
      </UForm>
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

onMounted(async () => {
  try {
    const user = await account.get();
    if (user.prefs && user.prefs.cafeID) {
      try {
        await databases.getDocument('cafe', 'cafe', user.prefs.cafeID);
        toast.add({ title: 'Cafe Found', description: 'Redirecting to your cafe...', color: 'primary' });
        router.push(`/${user.prefs.cafeID}/barista/menu`);
      } catch (e) {
        // Cafe not found, stay on page to create it
      }
    }
  } catch (e) {
    // User not logged in
  }
});

// Form state
const state = reactive({
  name: '',
  cafeID: ''
});

// Loading state for the button
const loading = ref(false);
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
  cafeID: z.string().min(3, 'Cafe ID must be at least 3 characters')
});

type Schema = z.output<typeof schema>;

// Watch the value of name and update cafeID accordingly
watch(() => state.name, (newName) => {
    state.cafeID = sanitizeCafeID(newName);
});

async function handleSetup(event: FormSubmitEvent<Schema>) {
  hasErrors.value = null;
  loading.value = true;

  state.cafeID = sanitizeCafeID(state.cafeID);

  try {
    // Verify user is logged in
    try {
        await account.get();
    } catch (e) {
        toast.add({ title: 'Authentication Error', description: 'You need to be logged in to complete setup.', color: 'error' });
        router.push('/login');
        return;
    }

    // Check if cafeID already exists
    const alreadyExists = await databases.listDocuments('cafe', 'cafe', [Query.equal('$id', state.cafeID)]);
    if (alreadyExists.total > 0) {
      toast.add({ title: 'Cafe ID already exists', description: 'Please choose a different cafe ID.', color: 'error' });
      loading.value = false;
      return;
    }

    const { name } = event.data;

    // Create a new document in the 'cafes' collection
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

    // Save the cafeID in the user's preferences
    await account.updatePrefs({
        cafeID: state.cafeID,
    });

    toast.add({ title: 'Setup Complete!', description: 'Your cafe is ready.', color: 'primary' });

    // Redirect to barista menu
    router.push(`/${state.cafeID}/barista/menu`);

  } catch (error: any) {
    console.error('Setup failed:', error);
    toast.add({ title: 'Setup Failed', description: error.message || 'An unexpected error occurred.', color: 'error' });
  } finally {
    loading.value = false;
  }
}
</script>
