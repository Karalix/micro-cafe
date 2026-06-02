<script setup lang="ts">
// Compact language picker. With strategy "no_prefix", setLocale() persists the
// choice in a cookie and updates the UI without changing the URL.
const { locale, locales, setLocale } = useI18n()

const options = computed(() =>
    (locales.value as { code: string; name: string }[]).map((l) => ({
        label: l.name,
        value: l.code,
    })),
)

function onChange(value: string) {
    setLocale(value as typeof locale.value)
}
</script>

<template>
    <USelect
        :model-value="locale"
        :items="options"
        value-key="value"
        icon="i-heroicons-language"
        color="neutral"
        variant="ghost"
        size="sm"
        :aria-label="$t('languageSwitcher.label')"
        :ui="{ base: 'text-coffee' }"
        @update:model-value="onChange"
    />
</template>
