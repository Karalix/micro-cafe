import { getMessaging, getToken, deleteToken, isSupported } from 'firebase/messaging'
import type { FirebaseApp } from 'firebase/app'

const STORAGE_KEY = 'appwrite_push_target'
const RESYNC_FLAG = 'appwrite_push_resync_v1'

interface StoredTarget {
    targetId: string
    identifier: string
}

export const usePushTarget = () => {
    const { $appwrite, $firebase } = useNuxtApp()
    const account = $appwrite.account
    const config = useRuntimeConfig()

    const syncPushTarget = async ({ requestPermission = false } = {}): Promise<boolean> => {
        if (!import.meta.client) return false
        if (!(await isSupported())) return false

        if (Notification.permission === 'denied') return false
        if (Notification.permission === 'default') {
            if (!requestPermission) return false
            const result = await Notification.requestPermission()
            if (result !== 'granted') return false
        }

        const messaging = getMessaging($firebase as FirebaseApp)

        // One-shot migration for users carrying tokens from a previous Firebase
        // project. Forces a fresh token tied to the current VAPID/service account.
        if (!localStorage.getItem(RESYNC_FLAG)) {
            try {
                await deleteToken(messaging)
                localStorage.removeItem(STORAGE_KEY)
            } catch {
                // no existing token to delete, ignore
            }
            localStorage.setItem(RESYNC_FLAG, '1')
        }

        const token = await getToken(messaging, {
            vapidKey: config.public.firebaseVapidKey as string,
        })
        if (!token) return false

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const { targetId, identifier } = JSON.parse(stored) as StoredTarget
            if (identifier === token) return true
            try {
                await account.updatePushTarget(targetId, token)
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ targetId, identifier: token } satisfies StoredTarget),
                )
                return true
            } catch {
                // target deleted server-side or session changed → fall through to create
            }
        }

        const target = await account.createPushTarget('unique()', token)
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ targetId: target.$id, identifier: token } satisfies StoredTarget),
        )
        return true
    }

    return { syncPushTarget }
}
