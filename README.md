# My Tiny Café

Here is the code for My Tiny Café. It's a big pile of shitty and messy code. I started the project during my parental leave in March just before the birth of my son. Most of the code was written while sleep deprived, some was vibe-coded. Because it was originaly only for my family and close firends, it's ridden with security holes.

A [Nuxt](https://nuxt.com) app deployed using [NuxtHub](https://hub.nuxt.com).

## The Nuxt app

Make sure to install the dependencies with [pnpm](https://pnpm.io/installation#using-corepack):

```bash
pnpm install
```

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

Build the application for production:

```bash
pnpm build
```

Deploy the application on the Edge with [NuxtHub](https://hub.nuxt.com) on your Cloudflare account:

```bash
npx nuxthub deploy
```

> [!NOTE]
> NuxtHub is soon sunsetting, it's on my todo to switch completely on Cloudflare. The app in itself has very little reliance on Cloudflare specificaly, it could be interesting to propose alternative deployment environments.

## The Appwrite backend

Okay things get a bit more complicated here if you want to replicate My Tiny Café. The backend is hosted on [Appwrite](https://appwrite.io) which is a very nice and complete PaaS, either on their cloud solution or as a self-hosted app (very easy to install and configure, unlike Supabase).

The steps should be somewhere like :

1. Create an [Appwrite account](https://cloud.appwrite.io/) or [self-host your instance](https://appwrite.io/docs/advanced/self-hosting)
2. Install the [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation#next-steps)
3. Initialize a new project
4. Import the database schema described in the file `appwrite.config.json` (refer to the [CLI doc](https://appwrite.io/docs/tooling/command-line/tables#push-table)) probably using the `appwrite push tables` command

That should be most of it (in theory). I haven't had to test it myself, I hope you'll be successful.

## Push Notifications

Because I don't know better, I relied on Firebase to implement Push Notifications. To be more precise, I rely on the Appwrite integration with Firebase through their [Messaging Product](https://appwrite.io/docs/products/messaging/fcm). Let's be honest, it was a pain and I don't remember how I achieved it, but you should do it too, push notifications is very important for the UX of this project.

Once your Firebase keys are setup, you can create a function in the Appwrite console that will send push notifications for every command. It's the `push-function.js` file at the root of the repo.