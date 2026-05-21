import { usePushTarget } from '~/composables/usePushTarget'

export default defineNuxtPlugin(async () => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return

    const { $appwrite } = useNuxtApp()
    try {
        await $appwrite.account.get()
    } catch {
        return
    }

    const { syncPushTarget } = usePushTarget()
    try {
        await syncPushTarget()
    } catch (e) {
        console.error('Push target sync failed:', e)
    }
})
