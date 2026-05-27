<template>
    <div class="pb-16 bg-latte min-h-screen">
        <UContainer class="py-8">
            <UCard class="bg-white dark:bg-latte-50 ring-1 ring-gray-200 dark:ring-gray-700">
                <template #header>
                    <h1 class="text-xl font-semibold leading-tight text-coffee">
                        Share Your Page
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Share this page using the URL or QR code below.
                    </p>
                </template>

                <div class="space-y-6">
                    <UFormGroup label="Page URL" name="pageUrl" help="This is the direct link to your page.">
                        <div class="flex items-center gap-2">
                            <UInput :model-value="pageUrl" readonly class="flex-grow" placeholder="Generating URL..."
                                icon="i-heroicons-link" size="lg" />
                            <UButton @click="handleCopyUrl" :icon="copied
                                    ? 'i-heroicons-check-circle-20-solid'
                                    : 'i-heroicons-clipboard-document-20-solid'
                                " :color="copied ? 'success' : 'primary'" variant="solid" square size="lg"
                                :disabled="!pageUrl">
                                {{ copied ? "Copied!" : "Copy" }}
                            </UButton>
                        </div>
                    </UFormGroup>

                    <UDivider />

                    <div>
                        <h2 class="text-lg font-medium text-coffee mb-2">
                            QR Code
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Scan this QR code with a mobile device to open the
                            page.
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
                                Download PNG
                            </UButton>
                        </div>
                        <div v-else class="text-center text-gray-500 py-10">
                            <p class="mb-2">
                                Page URL not available, QR code cannot be
                                generated.
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
                        Update Cafe Name
                    </h1>
                    <p class="text-sm text-gray-500">
                        Modify your cafe's name.
                    </p>
                </template>

                <div class="space-y-6">
                    <UFormGroup label="Cafe Name" name="cafeNameUpdate" help="Enter the new name for your cafe.">
                        <div class="flex items-center gap-2">
                            <UInput v-model="cafeNameInput" placeholder="Enter new cafe name" class="flex-grow"
                                icon="i-heroicons-identification-20-solid" size="lg" :disabled="!currentCafeId || isLoadingUpdateName
                                    " />
                            <UButton @click="handleUpdateCafeName" :loading="isLoadingUpdateName" :disabled="!cafeNameInput.trim() ||
                                !currentCafeId ||
                                isLoadingUpdateName
                                " icon="i-heroicons-arrow-path-20-solid" variant="solid" size="lg">
                                {{
                                    isLoadingUpdateName
                                        ? "Updating..."
                                        : "Update"
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
                        Custom Images
                    </h1>
                    <p class="text-sm text-gray-500">
                        Upload your own images to use in your menu items.
                    </p>
                </template>

                <div class="space-y-4">
                    <UButton @click="fileInputRef?.click()" icon="i-heroicons-arrow-up-tray-20-solid"
                        label="Upload Image" variant="solid" size="lg" />
                    <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleUploadImage" />

                    <div v-if="isLoadingImages" class="flex gap-4">
                        <USkeleton v-for="i in 3" :key="i" class="h-24 w-24 rounded-md" />
                    </div>
                    <div v-else-if="customImages.length === 0" class="text-center text-gray-500 py-8">
                        <UIcon name="i-heroicons-photo" class="mx-auto h-12 w-12 text-gray-400" />
                        <p class="mt-2">
                            No custom images yet. Upload one to get started.
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
                        About & Support
                    </h1>
                </template>

                <div class="space-y-6">
                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <UIcon name="i-simple-icons-github" class="w-6 h-6 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <h3 class="font-medium text-coffee">Open Source</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                This project is somewhat open source. The appwrite server configuration
                                available on Github is probably outdated, reach out if you need anything.
                            </p>
                            <UButton to="https://github.com/Karalix/micro-cafe" target="_blank" variant="link"
                                class="p-0">
                                View on GitHub
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
                                Contact the Maker
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Built by Alix. Reach out if you need anything.
                            </p>
                            <UButton to="https://krlx.fr" target="_blank" color="primary" variant="link" class="p-0">
                                What about hiring me for your next project ?
                            </UButton>
                        </div>
                    </div>

                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <UIcon name="i-heroicons-heart" class="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 class="font-medium text-coffee">
                                Support My Tiny Café
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                My Tiny Café is available free of charge, but if
                                you enjoy using it, consider supporting its
                                hosting costs.
                            </p>
                            <UButton to="https://buymeacoffee.com/krlx" target="_blank" color="primary" variant="link"
                                class="p-0">
                                Support on Buy Me a Coffee
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
                        Delete Account
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Permanently delete your café, its menu, all orders,
                        any custom images, and your account. This action
                        cannot be undone.
                    </p>
                </template>

                <UButton @click="openDeleteModal" icon="i-heroicons-trash-20-solid" color="error" variant="soft"
                    size="lg" :disabled="!currentCafeId">
                    Delete my account
                </UButton>
            </UCard>
        </UContainer>

        <UModal v-model:open="isDeleteModalOpen">
            <template #content>
                <div class="p-6 space-y-4">
                    <h2 class="text-lg font-semibold text-red-600">
                        Delete your account permanently?
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                        This will permanently delete:
                    </p>
                    <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>your café <strong>{{ currentCafeId }}</strong></li>
                        <li>its menu items and all past orders</li>
                        <li v-if="isPremium">your custom images</li>
                        <li>your account (you will not be able to log in again)</li>
                    </ul>
                    <UFormGroup :label="`Type &quot;${currentCafeId}&quot; to confirm`" name="deleteConfirm">
                        <UInput v-model="deleteConfirmInput" :placeholder="currentCafeId" size="lg"
                            :disabled="isDeletingAccount" />
                    </UFormGroup>
                    <div class="flex justify-end gap-2 pt-2">
                        <UButton @click="isDeleteModalOpen = false" color="neutral" variant="ghost"
                            :disabled="isDeletingAccount">
                            Cancel
                        </UButton>
                        <UButton @click="handleDeleteAccount" color="error" variant="solid" :loading="isDeletingAccount"
                            :disabled="deleteConfirmInput.trim() !== currentCafeId ||
                                isDeletingAccount
                                ">
                            Delete permanently
                        </UButton>
                    </div>
                </div>
            </template>
        </UModal>

        <UContainer class="py-8 mb-10">
            <UCard class="bg-white ring-1 ring-gray-200 dark:ring-gray-700 dark:bg-latte-50">
                <template #header>
                    <h1 class="text-xl font-semibold leading-tight text-coffee">
                        Session
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Sign out of this device. You can sign back in anytime.
                    </p>
                </template>

                <UButton @click="logout" icon="i-heroicons-arrow-right-on-rectangle-20-solid" color="neutral"
                    variant="outline" size="lg">
                    Logout
                </UButton>
            </UCard>
        </UContainer>
        <UNavigationMenu
            class="fixed bottom-4 my-4 left-1/2 -translate-x-1/2 flex flex-row justify-between px-2 rounded-lg bg-white drop-shadow-md"
            :items="[
                { label: 'Orders', to: `/${route.params.cafeId}/barista` },
                { label: 'Menu', to: `/${route.params.cafeId}/barista/menu` },
                { label: 'Cafe', to: `/${route.params.cafeId}/barista/cafe` },
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
            title: "Image Uploaded",
            description: `"${file.name}" has been uploaded.`,
            color: "primary",
            icon: "i-heroicons-check-circle",
        });
        await loadCustomImages();
    } catch (error: any) {
        console.error("Failed to upload image:", error);
        toast.add({
            title: "Upload Failed",
            description: error.message || "Could not upload the image.",
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
            "Delete this image? Items using it will show a broken image.",
        )
    )
        return;

    try {
        await storage.deleteFile("images", fileId);
        toast.add({
            title: "Image Deleted",
            description: "The image has been deleted.",
            color: "primary",
            icon: "i-heroicons-check-circle",
        });
        await loadCustomImages();
    } catch (error: any) {
        console.error("Failed to delete image:", error);
        toast.add({
            title: "Delete Failed",
            description: error.message || "Could not delete the image.",
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
            title: "Error",
            description: "Cafe ID is not available. Cannot update name.",
            color: "error",
            icon: "i-heroicons-x-circle-20-solid",
        });
        return;
    }

    if (!cafeNameInput.value.trim()) {
        toast.add({
            title: "Validation Error",
            description: "Cafe name cannot be empty.",
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
            title: "Success!",
            description: `Cafe name updated to "${cafeNameInput.value}".`,
            color: "primary",
            icon: "i-heroicons-check-circle-20-solid",
        });
    } catch (error) {
        console.error("Failed to update cafe name:", error);
        toast.add({
            title: "Update Failed",
            description: "Could not update cafe name. Please try again.",
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
                    title: "Missing Cafe ID",
                    description:
                        "The unique identifier for the cafe is missing from the URL.",
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
            title: "URL Not Available",
            description: "The page URL is not ready to be copied.",
            color: "warning",
            icon: "i-heroicons-exclamation-circle-20-solid",
        });
        return;
    }

    if (!clipboardIsSupported.value) {
        toast.add({
            title: "Clipboard Access Denied",
            description:
                "Your browser settings prevent clipboard access, or it's not supported.",
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
                title: "URL Copied!",
                description: "The page URL has been copied to your clipboard.",
                color: "primary",
                icon: "i-heroicons-check-circle-20-solid",
            });
        } else {
            // This might occur if copy() promise resolves but `copied` flag isn't set (e.g. legacy mode issues)
            toast.add({
                title: "Copy Unconfirmed",
                description: "Attempted to copy. Please verify your clipboard.",
                color: "primary",
                icon: "i-heroicons-information-circle-20-solid",
            });
        }
    } catch (error) {
        console.error("Failed to copy URL:", error);
        toast.add({
            title: "Copy Failed",
            description:
                "An error occurred while trying to copy the URL. Please copy it manually.",
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
            title: "Download Failed",
            description: "QR code is not ready yet. Please try again.",
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
            title: "QR Code Downloaded",
            description: "The QR code PNG has been saved.",
            color: "primary",
            icon: "i-heroicons-check-circle-20-solid",
        });
    } catch (error) {
        console.error("Failed to download QR code:", error);
        toast.add({
            title: "Download Failed",
            description: "Could not generate the PNG file. Please try again.",
            color: "error",
            icon: "i-heroicons-x-circle-20-solid",
        });
    }
}

const logout = async () => {
    await account.deleteSession("current");
    navigateTo("/");
    addToast({
        title: "Logged out",
        description: "You have been logged out",
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
            title: "Account deleted",
            description: "Your account and café have been permanently deleted.",
            color: "primary",
            icon: "i-heroicons-check-circle-20-solid",
        });
        isDeleteModalOpen.value = false;
        navigateTo("/");
    } catch (error: any) {
        console.error("Failed to delete account:", error);
        toast.add({
            title: "Deletion Failed",
            description:
                error.message ||
                "Could not delete your account. Please try again.",
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
