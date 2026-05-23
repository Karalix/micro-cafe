<script setup lang="ts">
const showSignupPrompt = ref(false);

const demoCafe = { name: "Chez Zola" };

const demoItems = [
    {
        $id: "demo-latte",
        name: "Latte",
        price: "4€",
        description: "Silky espresso topped with steamed milk.",
        options: ["Size:small;medium;large", "Milk:cow;oat;almond", "Sugar:boolean"],
        imageUrl: "/images-cafe/latte.png",
    },
    {
        $id: "demo-espresso",
        name: "Espresso",
        price: "3€",
        description: "Short, dark, intense. The classic.",
        options: ["Shots:single;double", "Sugar:boolean"],
        imageUrl: "/images-cafe/cafe.png",
    },
    {
        $id: "demo-matcha",
        name: "Matcha",
        price: "5€",
        description: "Whisked ceremonial-grade green tea.",
        options: ["Size:small;medium", "Milk:none;oat;almond", "Sugar:boolean"],
        imageUrl: "/images-cafe/gaiwan.png",
    },
    {
        $id: "demo-tea",
        name: "Tea",
        price: "3€",
        description: "Loose-leaf, steeped to order.",
        options: ["Blend:earl grey;chamomile;mint;rooibos", "Honey:boolean"],
        imageUrl: "/images-cafe/the.png",
    },
    {
        $id: "demo-juice",
        name: "Fresh Juice",
        price: "4€",
        description: "Pressed this morning.",
        options: ["Flavor:orange;apple;carrot-ginger"],
        imageUrl: "/images-cafe/jus.png",
    },
    {
        $id: "demo-bubble",
        name: "Bubble Tea",
        price: "6€",
        description: "Chewy tapioca, your favorite flavor.",
        options: ["Flavor:taro;mango;classic milk", "Ice:boolean"],
        imageUrl: "/images-cafe/bobba.png",
    },
    {
        $id: "demo-muffin",
        name: "Muffin",
        price: "3€",
        description: "Baked this morning.",
        options: ["Flavor:chocolate;blueberry;banana"],
        imageUrl: "/images-cafe/muffin.png",
    },
    {
        $id: "demo-cookie",
        name: "Cookie",
        price: "2€",
        description: "Warm and chewy.",
        options: ["Type:chocolate chip;oatmeal raisin", "Warmed:boolean"],
        imageUrl: "/images-cafe/cookie.png",
    },
    {
        $id: "demo-tartine",
        name: "Tartine",
        price: "5€",
        description: "Sourdough, toasted, with toppings.",
        options: ["Topping:butter & jam;avocado;honey & ricotta"],
        imageUrl: "/images-cafe/tartine.png",
    },
    {
        $id: "demo-yogurt",
        name: "Yogurt Bowl",
        price: "5€",
        description: "Greek yogurt, fresh fruits, granola.",
        options: ["Granola:boolean", "Honey:boolean"],
        imageUrl: "/images-cafe/yaourt.png",
    },
];

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

useHead({
    title: demoCafe.name,
    meta: [
        { name: "viewport", content: "width=device-width,initial-scale=1" },
        {
            name: "description",
            content: `Order your favorite items from ${demoCafe.name}`,
        },
        { name: "theme-color", content: "#f0e4d2" },
    ],
});
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
                    Want your own home café?
                </h2>
                <p class="text-coffee-600 mb-6 leading-relaxed">
                    If you'd love to open your own tiny café for friends and family,
                    sign up — it's totally free, ad-free, and takes about a minute.
                </p>
                <div class="flex flex-col sm:flex-row-reverse gap-3 sm:justify-center">
                    <UButton size="lg" block @click="goToSignup"
                        class="bg-coffee-500 hover:bg-coffee-600 text-white rounded-full justify-center">
                        Open my tiny café
                    </UButton>
                    <UButton size="lg" block color="neutral" variant="ghost" @click="showSignupPrompt = false"
                        class="text-coffee hover:bg-latte-100 justify-center">
                        Keep browsing
                    </UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>
