<template>
  <UCard class="max-w-sm mx-auto mt-10">
    <template #header>
      <h2 class="text-xl font-bold text-center">Create Account</h2>
    </template>

    <UForm :state="state" :schema="schema" @submit="handleSignup">
      <UFormGroup label="Name" name="name" class="mb-4">
        <UInput v-model="state.name" placeholder="Your Name" />
      </UFormGroup>

      <UFormGroup label="Email" name="email" class="mb-4">
        <UInput v-model="state.email" type="email" placeholder="you@example.com" />
      </UFormGroup>


      <UFormGroup label="Identifiant de café" name="cafeId" class="mb-4">
        <UInput v-model="state.cafeID" placeholder="Identifiant de café" />
      </UFormGroup>

      <UFormGroup label="Password" name="password" class="mb-6">
        <UInput v-model="state.password" type="password" placeholder="••••••••" />
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
        <NuxtLink to="/login" class="text-sm text-primary-500 hover:underline ml-1">
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
});

type Schema = z.output<typeof schema>;

/**
 * Handles the signup form submission.
 * Creates a new user account using Appwrite.
 */
async function handleSignup(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  // Before creating a new account, verify that the cafeID does not already exsist in the database
  const alreadyExists = await databases.listDocuments('cafe', 'cafe', [Query.equal('$id', state.cafeID)]);
  if (alreadyExists.total > 0) {
    toast.add({ title: 'Cafe ID already exists', description: 'Please choose a different cafe ID.', color: 'red' });
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

    toast.add({ title: 'Account Created!', description: 'Please login to continue.', color: 'green' });

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
    toast.add({ title: 'Signup Failed', description: error.message || 'An unexpected error occurred.', color: 'red' });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>