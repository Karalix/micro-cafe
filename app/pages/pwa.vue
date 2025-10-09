<script setup lang="ts">
const router = useRouter()

const lastVisitedCafe = localStorage.getItem('lastVisitedCafe')
if (lastVisitedCafe) {
    router.push('/' + lastVisitedCafe)
} else {
    router.push('/')
    console.log('No last visited cafe')
}
</script>

<template>
    <div>
        ... redirecting to your preferred cafe ...
    </div>
</template>