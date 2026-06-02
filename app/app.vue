<script setup lang="ts">
// Keep the document <html lang> and default meta in sync with the active locale.
// Individual pages may still override the title via their own useHead().
const { t, locale } = useI18n()

useHead(() => ({
    htmlAttrs: { lang: locale.value },
    title: t('app.name'),
    meta: [{ name: 'description', content: t('app.description') }],
}))
</script>

<template>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtPwaManifest />
  <UApp>
    <NuxtPage />
  </UApp>
</template>
