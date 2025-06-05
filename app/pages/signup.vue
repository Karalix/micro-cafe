<template>
  <UCard class="max-w-sm mx-auto mt-10">
    <template #header>
      <h2 class="text-xl font-bold text-center">Create Account</h2>
    </template>

    <UForm :state="state" :schema="schema" @submit="handleSignup" class="flex flex-col space-y-4">
      <UFormGroup label="Name" name="name" class="mb-4">
        <UInput v-model="state.name" placeholder="Your Name">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Your name</span>
          </label>
        </UInput> 
      </UFormGroup>

      <UFormGroup label="Email" name="email" class="mb-4">
        <UInput v-model="state.email" type="email" placeholder="you@example.com">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Email</span>
          </label>
        </UInput> 
      </UFormGroup>


      <UFormGroup label="Café ID" name="cafeId" class="mb-4">
        <UInput v-model="state.cafeID" placeholder="Café ID">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Your café ID</span>
          </label>
        </UInput> 
      </UFormGroup>

      <UFormGroup label="Password" name="password" class="mb-6">
        <UInput v-model="state.password" type="password" placeholder="••••••••">
          <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
            <span class="inline-flex bg-default px-1">Password</span>
          </label>
        </UInput> 
      </UFormGroup>

      <UButton type="submit" block :loading="loading">
        Sign Up
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?
        </span>
        <NuxtLink to="/login" class="text-sm text-primary hover:underline ml-1">
          Log In
        </NuxtLink>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { Client, Account, Databases, Query, ID } from 'appwrite';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('micro-cafe');
const account = new Account(client);
const databases = new Databases(client);
const toast = useToast();
const router = useRouter();

// Form state
const state = reactive({
  name: '',
  email: '',
  password: '',
  cafeID: ''
});

// Loading state for the button
const loading = ref(false);

// Validation schema using Zod
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  cafeID: z.string().min(3, 'Cafe ID must be at least 3 characters')
});

type Schema = z.output<typeof schema>;

// Watch the value of name and update cafeID accordingly "Jean Dupont" -> "jeandupont"
watch(() => state.name, (newName) => {
  state.cafeID = newName.toLowerCase().replace(/\s+/g, '');
  // Remove any non-alphanumeric characters
  state.cafeID = state.cafeID.replace(/[^a-z0-9]/g, '');
  // Remove any leading or trailing hyphens
  state.cafeID = state.cafeID.replace(/^-+|-+$/g, '');
  // Remove any consecutive hyphens
  state.cafeID = state.cafeID.replace(/-+/g, '-');
  // Limit to 20 characters
  state.cafeID = state.cafeID.slice(0, 20);
});

/**
 * Handles the signup form submission.
 * Creates a new user account using Appwrite.
 */
async function handleSignup(event: FormSubmitEvent<Schema>) {
  loading.value = true;
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
    await databases.createDocument('cafe', 'cafe', state.cafeID, {
        name: name,
    });

    // Save the cafeID in the user's preferences or profile
    await account.updatePrefs({
        cafeID: state.cafeID,
    });

    // Optionally, log the user in immediately after signup
    // await account.createEmailSession(email, password);
    // router.push('/'); // Redirect to dashboard or home

    // Redirect to login page after successful signup
    router.push(`/${state.cafeID}/barista`);

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