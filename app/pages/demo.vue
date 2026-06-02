<script setup lang="ts">
const { t } = useI18n();

const showSignupPrompt = ref(false);

const demoCafe = computed(() => ({ name: t("demo.cafeName") }));

// Option strings keep the structural "Name:value;value" / "Name:boolean" format the
// menu component parses; they are sample content rather than translatable UI copy.
const demoItems = computed(() => [
    {
        $id: "demo-latte",
        name: t("demo.items.latte.name"),
        price: t("demo.items.latte.price"),
        description: t("demo.items.latte.description"),
        options: ["Size:small;medium;large", "Milk:cow;oat;almond", "Sugar:boolean"],
        imageUrl: "/images-cafe/latte.png",
    },
    {
        $id: "demo-espresso",
        name: t("demo.items.espresso.name"),
        description: t("demo.items.espresso.description"),
        options: ["Shots:single;double", "Sugar:boolean"],
        imageUrl: "/images-cafe/cafe.png",
    },
    {
        $id: "demo-matcha",
        name: t("demo.items.matcha.name"),
        price: "5€",
        description: t("demo.items.matcha.description"),
        options: ["Size:small;medium", "Milk:none;oat;almond", "Sugar:boolean"],
        imageUrl: "/images-cafe/gaiwan.png",
    },
    {
        $id: "demo-tea",
        name: t("demo.items.tea.name"),
        description: t("demo.items.tea.description"),
        options: ["Blend:earl grey;chamomile;mint;rooibos", "Honey:boolean"],
        imageUrl: "/images-cafe/the.png",
    },
    {
        $id: "demo-juice",
        name: t("demo.items.juice.name"),
        description: t("demo.items.juice.description"),
        options: ["Flavor:orange;apple;carrot-ginger"],
        imageUrl: "/images-cafe/jus.png",
    },
    {
        $id: "demo-bubble",
        name: t("demo.items.bubble.name"),
        description: t("demo.items.bubble.description"),
        options: ["Flavor:taro;mango;classic milk", "Ice:boolean"],
        imageUrl: "/images-cafe/bobba.png",
    },
    {
        $id: "demo-muffin",
        name: t("demo.items.muffin.name"),
        description: t("demo.items.muffin.description"),
        options: ["Flavor:chocolate;blueberry;banana"],
        imageUrl: "/images-cafe/muffin.png",
    },
    {
        $id: "demo-cookie",
        name: t("demo.items.cookie.name"),
        price: "📖",
        description: t("demo.items.cookie.description"),
        options: ["Type:chocolate chip;oatmeal raisin", "Warmed:boolean"],
        imageUrl: "/images-cafe/cookie.png",
    },
    {
        $id: "demo-tartine",
        name: t("demo.items.tartine.name"),
        description: t("demo.items.tartine.description"),
        options: ["Topping:butter & jam;avocado;honey & ricotta"],
        imageUrl: "/images-cafe/tartine.png",
    },
    {
        $id: "demo-yogurt",
        name: t("demo.items.yogurt.name"),
        price: t("demo.items.yogurt.price"),
        description: t("demo.items.yogurt.description"),
        options: ["Granola:boolean", "Honey:boolean"],
        imageUrl: "/images-cafe/yaourt.png",
    },
]);

const demoOrders = ref([] as any[]);

async function submitOrder() {
    showSignupPrompt.value = true;
}

async function cancelOrder() {
    showSignupPrompt.value = true;
}

function goToSignup() {
    showSignupPrompt.value = false;
    navigateTo("/signup");
}

useHead(() => ({
    title: demoCafe.value.name,
    meta: [
        { name: "viewport", content: "width=device-width,initial-scale=1" },
        {
            name: "description",
            content: t("menu.headDescription", { cafeName: demoCafe.value.name }),
        },
        { name: "theme-color", content: "#f0e4d2" },
    ],
}));
</script>

<template>
    <CafeMenu :cafe="demoCafe" :items="demoItems" :orders="demoOrders" :submit-order="submitOrder"
        :cancel-order="cancelOrder" barista-link="/signup" />

    <UModal v-model:open="showSignupPrompt" :ui="{
        content: 'bg-white dark:bg-latte-50 sm:max-w-md',
        overlay: 'bg-coffee/50',
    }">
        <template #content>
            <div class="p-6 sm:p-8 text-center">
                <div class="text-5xl mb-4">☕</div>
                <h2 class="font-serif font-bold text-2xl text-coffee mb-3">
                    {{ $t('demo.promptTitle') }}
                </h2>
                <p class="text-coffee-600 mb-6 leading-relaxed">
                    {{ $t('demo.promptText') }}
                </p>
                <div class="flex flex-col sm:flex-row-reverse gap-3 sm:justify-center">
                    <UButton size="lg" block @click="goToSignup"
                        class="bg-coffee-500 hover:bg-coffee-600 text-white rounded-full justify-center">
                        {{ $t('demo.openCafe') }}
                    </UButton>
                    <UButton size="lg" block color="neutral" variant="ghost" @click="showSignupPrompt = false"
                        class="text-coffee hover:bg-latte-100 justify-center">
                        {{ $t('demo.keepBrowsing') }}
                    </UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>
