<template>
    <div class="pb-16 bg-latte min-h-screen">
        <UContainer class="py-8">
            <UCard class="bg-white dark:bg-latte-50 ring-1 ring-gray-200 dark:ring-gray-700">
                <template #header>
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <h1 class="text-xl font-semibold leading-tight text-coffee">
                                {{ $t('cafeSettings.share.title') }}
                            </h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ $t('cafeSettings.share.subtitle') }}
                            </p>
                        </div>
                        <LanguageSwitcher class="shrink-0" />
                    </div>
                </template>

                <div class="space-y-6">
                    <UFormGroup :label="$t('cafeSettings.share.pageUrlLabel')" name="pageUrl" :help="$t('cafeSettings.share.pageUrlHelp')">
                        <div class="flex items-center gap-2">
                            <UInput :model-value="pageUrl" readonly class="flex-grow" :placeholder="$t('cafeSettings.share.generatingUrl')"
                                icon="i-heroicons-link" size="lg" />
                            <UButton @click="handleCopyUrl" :icon="copied
                                    ? 'i-heroicons-check-circle-20-solid'
                                    : 'i-heroicons-clipboard-document-20-solid'
                                " :color="copied ? 'success' : 'primary'" variant="solid" square size="lg"
                                :disabled="!pageUrl">
                                {{ copied ? $t("common.copied") : $t("common.copy") }}
                            </UButton>
                        </div>
                    </UFormGroup>

                    <UDivider />

                    <div>
                        <h2 class="text-lg font-medium text-coffee mb-2">
                            {{ $t('cafeSettings.qr.title') }}
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {{ $t('cafeSettings.qr.subtitle') }}
                        </p>
                        <div v-if="pageUrl" ref="qrCodeContainerRef"
                            class="flex justify-center items-center p-4 bg-white rounded-lg shadow max-w-xs mx-auto border border-gray-100">
                            <ClientOnly>
                                <QrCodeVue :value="pageUrl" :size="220" level="H" render-as="svg" :margin="2" />
                                <template #fallback>
                                    <USkeleton class="h-[220px] w-[220px" />
                                </template>
                            </ClientOnly>
                        </div>
                        <div v-if="pageUrl" class="flex justify-center mt-4">
                            <UButton @click="handleDownloadQrCode"
                                icon="i-heroicons-arrow-down-tray-20-solid" variant="solid" size="lg">
                                {{ $t('cafeSettings.qr.downloadPng') }}
                            </UButton>
                        </div>
                        <div v-else class="text-center text-gray-500 py-10">
                            <p class="mb-2">
                                {{ $t('cafeSettings.qr.unavailable') }}
                            </p>
                            <USkeleton class="h-[220px] w-[220px mx-auto" />
                        </div>
                    </div>
                </div>
            </UCard>
        </UContainer>
        <UContainer class="py-8">
            <UCard class="bg-white ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-latte-50">
                <template #header>
                    <h1 class="text-xl font-semibold leading-tight text-coffee">
                        {{ $t('cafeSettings.updateName.title') }}
                    </h1>
                    <p class="text-sm text-gray-500">
                        {{ $t('cafeSettings.updateName.subtitle') }}
                    </p>
                </template>

                <div class="space-y-6">
                    <UFormGroup :label="$t('cafeSettings.updateName.label')" name="cafeNameUpdate" :help="$t('cafeSettings.updateName.help')">
                        <div class="flex items-center gap-2">
                            <UInput v-model="cafeNameInput" :placeholder="$t('cafeSettings.updateName.placeholder')" class="flex-grow"
                                icon="i-heroicons-identification-20-solid" size="lg" :disabled="!currentCafeId || isLoadingUpdateName
                                    " />
                            <UButton @click="handleUpdateCafeName" :loading="isLoadingUpdateName" :disabled="!cafeNameInput.trim() ||
                                !currentCafeId ||
                                isLoadingUpdateName
                                " icon="i-heroicons-arrow-path-20-solid" variant="solid" size="lg">
                                {{
                                    isLoadingUpdateName
                                        ? $t("cafeSettings.updateName.updating")
                                        : $t("cafeSettings.updateName.update")
                                }}
                            </UButton>
                        </div>
                    </UFormGroup>
                    <!-- Additional cafe settings can be added here -->
                </div>
            </UCard>
        </UContainer>

        <UContainer v-if="isPremium" class="py-8">
            <UCard class="bg-white ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-latte-50">
                <template #header>
                    <h1 class="text-xl font-semibold leading-tight text-coffee">
                        {{ $t('cafeSettings.customImages.title') }}
                    </h1>
                    <p class="text-sm text-gray-500">
                        {{ $t('cafeSettings.customImages.subtitle') }}
                    </p>
                </template>

                <div class="space-y-4">
                    <UButton @click="fileInputRef?.click()" icon="i-heroicons-arrow-up-tray-20-solid"
                        :label="$t('cafeSettings.customImages.upload')" variant="solid" size="lg" />
                    <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleUploadImage" />

                    <div v-if="isLoadingImages" class="flex gap-4">
                        <USkeleton v-for="i in 3" :key="i" class="h-24 w-24 rounded-md" />
                    </div>
                    <div v-else-if="customImages.length === 0" class="text-center text-gray-500 py-8">
                        <UIcon name="i-heroicons-photo" class="mx-auto h-12 w-12 text-gray-400" />
                        <p class="mt-2">
                            {{ $t('cafeSettings.customImages.empty') }}
                        </p>
                    </div>
                    <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        <div v-for="image in customImages" :key="image.$id" class="relative group">
                            <img :src="image.url" :alt="image.name"
                                class="w-full aspect-square rounded-md object-cover border border-gray-200" />
                            <p class="text-xs text-gray-600 mt-1 truncate">
                                {{ image.name }}
                            </p>
                            <UButton @click="handleDeleteImage(image.$id)" icon="i-heroicons-trash-20-solid"
                                color="error" variant="soft" size="xs"
                                class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </UCard>
        </UContainer>

        <UContainer class="py-8">
            <UCard class="bg-white ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-latte-50">
                <template #header>
                    <h1 class="text-xl font-semibold leading-tight text-coffee">
                        {{ $t('cafeSettings.about.title') }}
                    </h1>
                </template>

                <div class="space-y-6">
                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <UIcon name="i-simple-icons-github" class="w-6 h-6 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <h3 class="font-medium text-coffee">{{ $t('cafeSettings.about.openSourceTitle') }}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {{ $t('cafeSettings.about.openSourceText') }}
                            </p>
                            <UButton to="https://github.com/Karalix/micro-cafe" target="_blank" variant="link"
                                class="p-0">
                                {{ $t('cafeSettings.about.viewOnGithub') }}
                            </UButton>
                        </div>
                    </div>

                    <UDivider />

                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 class="font-medium text-coffee">
                                {{ $t('cafeSettings.about.contactTitle') }}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {{ $t('cafeSettings.about.contactText') }}
                            </p>
                            <UButton to="https://krlx.fr" target="_blank" color="primary" variant="link" class="p-0">
                                {{ $t('cafeSettings.about.hireText') }}
                            </UButton>
                        </div>
                    </div>

                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <UIcon name="i-heroicons-heart" class="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 class="font-medium text-coffee">
                                {{ $t('cafeSettings.about.supportTitle') }}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {{ $t('cafeSettings.about.supportText') }}
                            </p>
                            <UButton to="https://buymeacoffee.com/krlx" target="_blank" color="primary" variant="link"
                                class="p-0">
                                {{ $t('cafeSettings.about.supportButton') }}
                            </UButton>
                        </div>
                    </div>
                </div>
            </UCard>
        </UContainer>
        <UContainer class="py-8">
            <UCard class="bg-white ring-1 ring-red-200 dark:ring-red-900/40 dark:bg-latte-50">
                <template #header>
                    <h1 class="text-xl font-semibold leading-tight text-red-600">
                        {{ $t('cafeSettings.delete.title') }}
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ $t('cafeSettings.delete.subtitle') }}
                    </p>
                </template>

                <UButton @click="openDeleteModal" icon="i-heroicons-trash-20-solid" color="error" variant="soft"
                    size="lg" :disabled="!currentCafeId">
                    {{ $t('cafeSettings.delete.button') }}
                </UButton>
            </UCard>
        </UContainer>

        <UModal v-model:open="isDeleteModalOpen">
            <template #content>
                <div class="p-6 space-y-4">
                    <h2 class="text-lg font-semibold text-red-600">
                        {{ $t('cafeSettings.delete.modalTitle') }}
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                        {{ $t('cafeSettings.delete.modalIntro') }}
                    </p>
                    <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <i18n-t keypath="cafeSettings.delete.modalListCafe" tag="li">
                            <template #id><strong>{{ currentCafeId }}</strong></template>
                        </i18n-t>
                        <li>{{ $t('cafeSettings.delete.modalListMenu') }}</li>
                        <li v-if="isPremium">{{ $t('cafeSettings.delete.modalListImages') }}</li>
                        <li>{{ $t('cafeSettings.delete.modalListAccount') }}</li>
                    </ul>
                    <UFormGroup :label="$t('cafeSettings.delete.confirmLabel', { cafeId: currentCafeId })" name="deleteConfirm">
                        <UInput v-model="deleteConfirmInput" :placeholder="currentCafeId" size="lg"
                            :disabled="isDeletingAccount" />
                    </UFormGroup>
                    <div class="flex justify-end gap-2 pt-2">
                        <UButton @click="isDeleteModalOpen = false" color="neutral" variant="ghost"
                            :disabled="isDeletingAccount">
                            {{ $t('common.cancel') }}
                        </UButton>
                        <UButton @click="handleDeleteAccount" color="error" variant="solid" :loading="isDeletingAccount"
                            :disabled="deleteConfirmInput.trim() !== currentCafeId ||
                                isDeletingAccount
                                ">
                            {{ $t('cafeSettings.delete.deletePermanently') }}
                        </UButton>
                    </div>
                </div>
            </template>
        </UModal>

        <UContainer class="py-8 mb-10">
            <UCard class="bg-white ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-latte-50">
                <template #header>
                    <h1 class="text-xl font-semibold leading-tight text-coffee">
                        {{ $t('cafeSettings.session.title') }}
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ $t('cafeSettings.session.subtitle') }}
                    </p>
                </template>

                <UButton @click="logout" icon="i-heroicons-arrow-right-on-rectangle-20-solid" color="neutral"
                    variant="outline" size="lg">
                    {{ $t('cafeSettings.session.logout') }}
                </UButton>
            </UCard>
        </UContainer>
        <UNavigationMenu
            class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-white drop-shadow-md"
            :items="[
                { label: $t('nav.orders'), to: `/${route.params.cafeId}/barista` },
                { label: $t('nav.menu'), to: `/${route.params.cafeId}/barista/menu` },
                { label: $t('nav.cafe'), to: `/${route.params.cafeId}/barista/cafe` },
            ]" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ID, Permission, Role } from "appwrite";
import { useRoute } from "#imports"; // Nuxt auto-imports route composable
import { useToast } from "#imports"; // Nuxt UI auto-imports toast composable
import QrCodeVue from "qrcode.vue"; // Import QR Code component
import { useClipboard } from "@vueuse/core"; // For advanced clipboard functionality

const { add: addToast } = useToast(); // Optional: For success/error notifications
const { t } = useI18n();

const { $appwrite } = useNuxtApp();
const databases = $appwrite.databases;
const account = $appwrite.account;
const storage = $appwrite.storage;

// Premium image gallery
const isPremium = ref(false);
const userId = ref("");
const customImages = ref<{ $id: string; name: string; url: string }[]>([]);
const isLoadingImages = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const checkPremiumAndLoadImages = async () => {
    try {
        const user = await account.get();
        userId.value = user.$id;
        isPremium.value = user.labels?.includes("premium") ?? false;
        if (isPremium.value) {
            await loadCustomImages();
        }
    } catch (e) {
        // Not logged in or error — ignore
    }
};

const loadCustomImages = async () => {
    isLoadingImages.value = true;
    try {
        const response = await storage.listFiles("images");
        const ownedFiles = response.files.filter((file: any) =>
            file.$permissions.includes(`delete("user:${userId.value}")`)
        );
        customImages.value = ownedFiles.map((file: any) => ({
            $id: file.$id,
            name: file.name,
            url: storage.getFileView("images", file.$id).toString(),
        }));
    } catch (error) {
        console.error("Failed to load custom images:", error);
    } finally {
        isLoadingImages.value = false;
    }
};

const handleUploadImage = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
        await storage.createFile("images", ID.unique(), file, [
            Permission.read(Role.any()),
            Permission.update(Role.user(userId.value)),
            Permission.delete(Role.user(userId.value)),
        ]);
        toast.add({
            title: t("cafeSettings.toast.imageUploadedTitle"),
            description: t("cafeSettings.toast.imageUploadedDesc", { name: file.name }),
            color: "primary",
            icon: "i-heroicons-check-circle",
        });
        await loadCustomImages();
    } catch (error: any) {
        console.error("Failed to upload image:", error);
        toast.add({
            title: t("cafeSettings.toast.uploadFailedTitle"),
            description: error.message || t("cafeSettings.toast.uploadFailedDesc"),
            color: "error",
            icon: "i-heroicons-x-circle",
        });
    } finally {
        input.value = ""; // Reset file input
    }
};

const handleDeleteImage = async (fileId: string) => {
    if (
        !window.confirm(
            t("cafeSettings.toast.confirmDeleteImage"),
        )
    )
        return;

    try {
        await storage.deleteFile("images", fileId);
        toast.add({
            title: t("cafeSettings.toast.imageDeletedTitle"),
            description: t("cafeSettings.toast.imageDeletedDesc"),
            color: "primary",
            icon: "i-heroicons-check-circle",
        });
        await loadCustomImages();
    } catch (error: any) {
        console.error("Failed to delete image:", error);
        toast.add({
            title: t("cafeSettings.toast.deleteFailedTitle"),
            description: error.message || t("cafeSettings.toast.deleteFailedDesc"),
            color: "error",
            icon: "i-heroicons-x-circle",
        });
    }
};

checkPremiumAndLoadImages();

// Define types for route parameters for better type safety if needed.
// interface CafeRouteParams {
//   cafeId: string | string[];
// }

const route = useRoute();
const toast = useToast();

const currentCafeId = ref<string | undefined>(undefined);

// --- Refs and logic for "Update Cafe Details" ---
const cafeNameInput = ref<string>("");
const isLoadingUpdateName = ref<boolean>(false);

/**
 * Handles the action of updating the cafe's name.
 * This function would typically call an API to persist the change.
 * Provides feedback via toast notifications.
 */
async function handleUpdateCafeName(): Promise<void> {
    if (!currentCafeId.value) {
        toast.add({
            title: t("cafeSettings.toast.errorTitle"),
            description: t("cafeSettings.toast.cafeIdUnavailable"),
            color: "error",
            icon: "i-heroicons-x-circle-20-solid",
        });
        return;
    }

    if (!cafeNameInput.value.trim()) {
        toast.add({
            title: t("cafeSettings.toast.validationErrorTitle"),
            description: t("cafeSettings.toast.cafeNameEmpty"),
            color: "warning",
            icon: "i-heroicons-exclamation-circle-20-solid",
        });
        return;
    }

    isLoadingUpdateName.value = true;
    try {
        await databases.updateDocument("cafe", "cafe", currentCafeId.value, {
            name: cafeNameInput.value,
        });

        toast.add({
            title: t("cafeSettings.toast.successTitle"),
            description: t("cafeSettings.toast.cafeNameUpdated", { name: cafeNameInput.value }),
            color: "primary",
            icon: "i-heroicons-check-circle-20-solid",
        });
    } catch (error) {
        console.error("Failed to update cafe name:", error);
        toast.add({
            title: t("cafeSettings.toast.updateFailedTitle"),
            description: t("cafeSettings.toast.updateNameFailedDesc"),
            color: "error",
            icon: "i-heroicons-x-circle-20-solid",
        });
    } finally {
        isLoadingUpdateName.value = false;
    }
}

/**
 * Watches the route parameter 'cafeId' for changes.
 * Updates `currentCafeId` when the route parameter is available or changes.
 * Shows a toast notification if the 'cafeId' is missing, as it's crucial for this page.
 */
watch(
    () => route.params.cafeId,
    (newCafeIdParam) => {
        const id = Array.isArray(newCafeIdParam)
            ? newCafeIdParam[0]
            : newCafeIdParam;
        if (id && typeof id === "string") {
            currentCafeId.value = id;
        } else {
            currentCafeId.value = undefined;
            // Only show toast on client-side after router is ready and if cafeId is truly missing
            if (process.client && route.fullPath !== "/" && route.name) {
                // Ensure route is resolved
                toast.add({
                    title: t("cafeSettings.toast.missingCafeIdTitle"),
                    description:
                        t("cafeSettings.toast.missingCafeIdDesc"),
                    color: "warning",
                    icon: "i-heroicons-exclamation-triangle-20-solid",
                });
            }
        }
    },
    { immediate: true }, // Run the watcher immediately on component mount
);

/**
 * Computed property for the full page URL.
 * Constructs the URL based on the `currentCafeId`.
 * Example: https://mytinycafe.com/my-cafe-123
 */
const pageUrl = computed<string>(() => {
    if (currentCafeId.value) {
        // Ensure cafeId is properly encoded if it might contain special characters
        return `https://mytinycafe.com/${encodeURIComponent(currentCafeId.value)}`;
    }
    return ""; // Return empty string if cafeId is not available
});

// useClipboard composable from @vueuse/core
// `source` is a ref, so it will copy the latest `pageUrl.value`
// `copied` is a ref that becomes true for a short duration after successful copy
const {
    copy,
    copied,
    isSupported: clipboardIsSupported,
} = useClipboard({
    source: pageUrl,
    legacy: true, // Uses older execCommand based copying if Clipboard API is not available
});

/**
 * Handles the action of copying the page URL to the user's clipboard.
 * Provides feedback via toast notifications.
 */
async function handleCopyUrl(): Promise<void> {
    if (!pageUrl.value) {
        toast.add({
            title: t("cafeSettings.toast.urlNotAvailableTitle"),
            description: t("cafeSettings.toast.urlNotAvailableDesc"),
            color: "warning",
            icon: "i-heroicons-exclamation-circle-20-solid",
        });
        return;
    }

    if (!clipboardIsSupported.value) {
        toast.add({
            title: t("cafeSettings.toast.clipboardDeniedTitle"),
            description:
                t("cafeSettings.toast.clipboardDeniedDesc"),
            color: "error",
            icon: "i-heroicons-no-symbol-20-solid",
        });
        // As a fallback, you could select the text in the input for manual copying
        // const inputElement = document.querySelector<HTMLInputElement>('input[name="pageUrl"');
        // inputElement?.select();
        return;
    }

    try {
        await copy(pageUrl.value); // Attempt to copy the current URL
        if (copied.value) {
            // `copied` ref from useClipboard indicates success
            toast.add({
                title: t("cafeSettings.toast.urlCopiedTitle"),
                description: t("cafeSettings.toast.urlCopiedDesc"),
                color: "primary",
                icon: "i-heroicons-check-circle-20-solid",
            });
        } else {
            // This might occur if copy() promise resolves but `copied` flag isn't set (e.g. legacy mode issues)
            toast.add({
                title: t("cafeSettings.toast.copyUnconfirmedTitle"),
                description: t("cafeSettings.toast.copyUnconfirmedDesc"),
                color: "primary",
                icon: "i-heroicons-information-circle-20-solid",
            });
        }
    } catch (error) {
        console.error("Failed to copy URL:", error);
        toast.add({
            title: t("cafeSettings.toast.copyFailedTitle"),
            description:
                t("cafeSettings.toast.copyFailedDesc"),
            color: "error",
            icon: "i-heroicons-x-circle-20-solid",
        });
    }
}

const qrCodeContainerRef = ref<HTMLElement | null>(null);

async function handleDownloadQrCode(): Promise<void> {
    const svgElement = qrCodeContainerRef.value?.querySelector("svg");
    if (!svgElement) {
        toast.add({
            title: t("cafeSettings.toast.downloadFailedTitle"),
            description: t("cafeSettings.toast.qrNotReady"),
            color: "error",
            icon: "i-heroicons-x-circle-20-solid",
        });
        return;
    }

    try {
        const scale = 4;
        const svgRect = svgElement.getBoundingClientRect();
        const width = svgRect.width || 220;
        const height = svgRect.height || 220;

        const clonedSvg = svgElement.cloneNode(true) as SVGElement;
        clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        clonedSvg.setAttribute("width", String(width));
        clonedSvg.setAttribute("height", String(height));

        const svgString = new XMLSerializer().serializeToString(clonedSvg);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("Failed to load SVG image"));
            image.src = svgUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context not available");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(svgUrl);

        const pngBlob: Blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
                "image/png",
            );
        });

        const downloadUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `qrcode-${currentCafeId.value ?? "cafe"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        toast.add({
            title: t("cafeSettings.toast.qrDownloadedTitle"),
            description: t("cafeSettings.toast.qrDownloadedDesc"),
            color: "primary",
            icon: "i-heroicons-check-circle-20-solid",
        });
    } catch (error) {
        console.error("Failed to download QR code:", error);
        toast.add({
            title: t("cafeSettings.toast.downloadFailedTitle"),
            description: t("cafeSettings.toast.qrGenerateFailed"),
            color: "error",
            icon: "i-heroicons-x-circle-20-solid",
        });
    }
}

const logout = async () => {
    await account.deleteSession("current");
    navigateTo("/");
    addToast({
        title: t("cafeSettings.toast.loggedOutTitle"),
        description: t("cafeSettings.toast.loggedOutDesc"),
        color: "primary",
    });
};

const isDeleteModalOpen = ref(false);
const deleteConfirmInput = ref("");
const isDeletingAccount = ref(false);

function openDeleteModal() {
    deleteConfirmInput.value = "";
    isDeleteModalOpen.value = true;
}

async function handleDeleteAccount() {
    if (!currentCafeId.value) return;
    if (deleteConfirmInput.value.trim() !== currentCafeId.value) return;

    isDeletingAccount.value = true;
    try {
        if (isPremium.value && customImages.value.length > 0) {
            const results = await Promise.allSettled(
                customImages.value.map((image) =>
                    storage.deleteFile("images", image.$id),
                ),
            );
            results
                .filter((r) => r.status === "rejected")
                .forEach((r) =>
                    console.error("Failed to delete image:", (r as PromiseRejectedResult).reason),
                );
        }

        await databases.deleteDocument("cafe", "cafe", currentCafeId.value);

        await account.updateStatus();

        toast.add({
            title: t("cafeSettings.toast.accountDeletedTitle"),
            description: t("cafeSettings.toast.accountDeletedDesc"),
            color: "primary",
            icon: "i-heroicons-check-circle-20-solid",
        });
        isDeleteModalOpen.value = false;
        navigateTo("/");
    } catch (error: any) {
        console.error("Failed to delete account:", error);
        toast.add({
            title: t("cafeSettings.toast.deletionFailedTitle"),
            description:
                error.message ||
                t("cafeSettings.toast.deletionFailedDesc"),
            color: "error",
            icon: "i-heroicons-x-circle-20-solid",
        });
        isDeletingAccount.value = false;
    }
}

// Nuxt UI components like UPage, UCard, UInput, UButton, etc.,
// and composables like useRoute, useToast are auto-imported by Nuxt.
// Ensure 'qrcode.vue' and '@vueuse/core' are installed in your project:
// `npm install qrcode.vue @vueuse/core` or `yarn add qrcode.vue @vueuse/core`
</script>

<style scoped>
/* Scoped styles for this page component */
.dark .dark\:bg-gray-50 {
    /* Specific override if needed for QR code background in dark mode, qrcode.vue usually handles this well with SVG */
    background-color: #f9fafb;
    /* Tailwind gray-50 */
}
</style>
