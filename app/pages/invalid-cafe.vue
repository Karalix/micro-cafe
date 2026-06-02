<template>
    <div class="bg-latte min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div class="max-w-xl w-full text-center space-y-8">
            <div
                class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white dark:bg-latte-50 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 mx-auto">
                <UIcon name="i-heroicons-cup-saucer" class="w-10 h-10 text-coffee-500" />
            </div>

            <div class="space-y-3">
                <h1 class="text-4xl sm:text-5xl font-serif font-bold text-coffee leading-tight">
                    {{ $t('invalidCafe.title') }}
                </h1>
                <i18n-t keypath="invalidCafe.text" tag="p" class="text-lg text-gray-600 dark:text-gray-400">
                    <template #you><span class="text-coffee-500 font-semibold">{{ $t('invalidCafe.textHighlight') }}</span></template>
                </i18n-t>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <UButton to="/signup" size="xl"
                    class="bg-coffee-500 hover:bg-coffee-600 text-white px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 justify-center">
                    {{ $t('invalidCafe.openOwn') }}
                </UButton>
                <UButton to="/" size="xl" variant="ghost" color="neutral"
                    class="text-coffee hover:bg-latte-100 px-8 rounded-full justify-center">
                    {{ $t('invalidCafe.backHome') }}
                </UButton>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400 italic pt-4">
                {{ $t('invalidCafe.noCreditCard') }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
useHead({
    title: t('invalidCafe.headTitle'),
});
</script>
