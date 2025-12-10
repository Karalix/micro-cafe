<script setup lang="ts">
const router = useRouter()

const lastVisitedCafe = localStorage.getItem('lastVisitedCafe')
if (lastVisitedCafe) {
    setTimeout(() => {
        router.push(`/${lastVisitedCafe}`)
    }, 1500)
} else {
    router.push('/')
    console.log('No last visited cafe')
}
</script>

<template>
    <div class="min-h-screen bg-latte flex flex-col items-center justify-center p-4 text-center">
        <div class="animate-bounce mb-6">
            <UIcon name="i-lucide-coffee" class="w-20 h-20 text-coffee-500" />
        </div>
        <h2 class="text-2xl font-bold text-coffee mb-2">Finding your spot...</h2>
        <p class="text-coffee-600 animate-pulse">Redirecting you to your last visited café.</p>
    </div>
</template>