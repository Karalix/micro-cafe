import { Client, Account, Databases } from 'appwrite';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const client = new Client();

  client
    .setEndpoint(config.public.appwrite.endpoint)
    .setProject(config.public.appwrite.projectId);

  return {
    provide: {
      appwrite: {
        client,
        account: new Account(client),
        databases: new Databases(client)
      }
    }
  }
});
