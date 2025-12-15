<template>
  <div class="min-h-screen bg-latte text-gray-700 font-sans selection:bg-latte-200 selection:text-coffee">
    
    <!-- Navbar -->
    <nav class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div class="text-xl font-bold text-coffee flex items-center gap-2">
        <UIcon name="i-heroicons-cup-saucer" class="w-6 h-6" />
        <span>My Tiny Café</span>
      </div>
      <div class="flex items-center gap-4">
        <UButton 
          to="/login" 
          variant="ghost" 
          color="neutral" 
          label="Login" 
          class="hidden sm:flex hover:bg-latte-100"
        />
        <UButton 
          to="/signup" 
          color="primary" 
          variant="solid" 
          label="Open My Tiny Café" 
          class="bg-coffee-500 hover:bg-coffee-600 text-white transition-colors duration-300"
        />
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div class="text-center lg:text-left space-y-8">
            <h1 class="text-5xl lg:text-7xl font-serif font-bold text-coffee leading-tight">
              Turn Your Home into the <span class="text-coffee-500">Best Coffee Shop</span> in Town.
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              The digital menu for home baristas. Create your drink list, share your QR code with friends and family, and receive orders straight to your phone. 
              <br class="hidden lg:block" />
              <span class="font-semibold text-coffee-500">100% Free. 100% Cozy.</span>
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <UButton 
                to="/signup" 
                size="xl"
                class="bg-coffee-500 hover:bg-coffee-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 justify-center"
              >
                Open My Tiny Café
              </UButton>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 italic">
              No credit card required. No ads. Just love.
            </p>
          </div>

          <!-- Hero Image / Mockup -->
          <div class="relative mx-auto w-full max-w-[300px] lg:max-w-[400px]">
             <!-- Phone Mockup -->
             <div class="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl mx-auto">
                <div class="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                <div class="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                <div class="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                <div class="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                <div class="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-latte-50 relative">
                    <!-- Screen Content -->
                    <div class="bg-latte h-full flex flex-col">
                        <!-- Notification Banner -->
                        <div class="mx-4 mt-12 bg-white/90 dark:bg-latte-50/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-start gap-3 animate-pulse">
                            <div class="bg-coffee-500 p-1.5 rounded-lg shrink-0">
                                <UIcon name="i-heroicons-cup-saucer" class="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p class="text-xs font-semibold text-coffee">New Order from Magali</p>
                                <p class="text-xs text-gray-600">Latte (Oat Milk, No Sugar)</p>
                            </div>
                            <span class="text-[10px] text-gray-400 ml-auto">now</span>
                        </div>

                        <!-- App Content Mock -->
                        <div class="p-6 mt-4 space-y-4">
                            <h3 class="font-serif text-2xl text-coffee font-bold">Menu</h3>
                            <div class="space-y-3">
                                <div class="p-3 bg-white dark:bg-latte-50 rounded-xl shadow-sm border border-latte-100 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p class="font-medium text-coffee">Latte</p>
                                        <p class="text-xs text-gray-500">Silky & Smooth</p>
                                    </div>
                                    <UIcon name="i-heroicons-plus-circle" class="w-6 h-6 text-coffee-500" />
                                </div>
                                <div class="p-3 bg-white dark:bg-latte-50 rounded-xl shadow-sm border border-latte-100 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p class="font-medium text-coffee">Matcha Latte</p>
                                        <p class="text-xs text-gray-500">Ceremonial Grade</p>
                                    </div>
                                    <UIcon name="i-heroicons-plus-circle" class="w-6 h-6 text-coffee-500" />
                                </div>
                                                                  <div class="p-3 bg-white dark:bg-latte-50 rounded-xl shadow-sm border border-latte-100 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p class="font-medium text-coffee">Tisane</p>
                                        <p class="text-xs text-gray-500">Relaxing blend</p>
                                    </div>
                                    <UIcon name="i-heroicons-plus-circle" class="w-6 h-6 text-coffee-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Decorative Elements -->
            <div class="absolute -z-10 top-1/2 -right-12 w-64 h-64 bg-green-soft rounded-full blur-3xl opacity-60"></div>
            <div class="absolute -z-10 bottom-0 -left-12 w-72 h-72 bg-latte-100 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>
      </div>
    </header>

    <!-- Value Proposition -->
    <section class="py-20 bg-white dark:bg-latte-50">
      <div class="max-w-4xl mx-auto px-6 text-center space-y-12">
        <div class="space-y-4">
          <h2 class="text-sm font-bold tracking-widest text-coffee-500 uppercase">Hospitality, Upgraded</h2>
          <h3 class="text-3xl lg:text-4xl font-serif font-bold text-coffee">
            Why shout from the kitchen?
          </h3>
        </div>
        
        <div class="grid md:grid-cols-2 gap-12 items-start">
            <div class="bg-latte-50 p-8 rounded-3xl h-full">
                <div class="text-4xl mb-4">😫</div>
                <h4 class="font-bold text-lg mb-2 text-coffee">The Problem</h4>
                <p class="text-gray-600 dark:text-gray-400">
                    Shouting from the kitchen, "Who wants tea?" and forgetting who wanted sugar and who wanted almond milk by the time the kettle boils.
                </p>
            </div>
            <div class="bg-green-soft p-8 rounded-3xl h-full">
                <div class="text-4xl mb-4">✨</div>
                <h4 class="font-bold text-lg mb-2 text-coffee">The Solution</h4>
                <p class="text-gray-600 dark:text-gray-400">
                    My Tiny Café brings the delight of a boutique coffee shop experience to your living room. Make the moment special.
                </p>
            </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-latte">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl lg:text-4xl font-serif font-bold text-center text-coffee mb-16">
          How It Works (3 Simple Steps)
        </h2>
        
        <div class="grid md:grid-cols-3 gap-12">
          <!-- Step 1 -->
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-coffee-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-3">
              <UIcon name="i-heroicons-clipboard-document-list" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-coffee">1. Build Your Menu</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Give your café a name. Add your specialties—Latte, Tisane, or Tartine. Customize options for milk and sugar.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-coffee-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg -rotate-3">
              <UIcon name="i-heroicons-qr-code" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-coffee">2. Share the Link</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Print your QR code for the fridge or text the link. Guests browse and customize their beverage exactly how they like it.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-coffee-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-3">
              <UIcon name="i-heroicons-bell-alert" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-coffee">3. Get Notified & Serve</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Ding! You get a notification instantly. No money changes hands—just a perfect cup served with a smile.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-white dark:bg-latte-50">
      <div class="max-w-5xl mx-auto px-6">
        <div class="bg-coffee dark:bg-latte-100 rounded-[3rem] p-8 lg:p-16 text-white shadow-2xl">
            <h2 class="text-3xl font-serif font-bold mb-12 text-center">Features</h2>
            <div class="grid md:grid-cols-2 gap-x-12 gap-y-8">
                <div class="flex gap-4">
                    <UIcon name="i-lucide-coffee" class="w-6 h-6 text-green-pale shrink-0" />
                    <div>
                        <h4 class="font-bold text-lg mb-1">Fully Customizable Menu</h4>
                        <p class="text-gray-300 text-sm">From "Tisane d'allaitement" to "Iced Matcha", you define what you serve.</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <UIcon name="i-heroicons-device-phone-mobile" class="w-6 h-6 text-green-pale shrink-0" />
                    <div>
                        <h4 class="font-bold text-lg mb-1">Instant Push Notifications</h4>
                        <p class="text-gray-300 text-sm">Never miss an order. You’ll know the second your "customer" submits their request.</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <UIcon name="i-heroicons-arrow-down-tray" class="w-6 h-6 text-green-pale shrink-0" />
                    <div>
                        <h4 class="font-bold text-lg mb-1">Zero App Download</h4>
                        <p class="text-gray-300 text-sm">Guests just scan (or click) and order. No installation needed.</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <UIcon name="i-heroicons-heart" class="w-6 h-6 text-green-pale shrink-0" />
                    <div>
                        <h4 class="font-bold text-lg mb-1">Totally Free</h4>
                        <p class="text-gray-300 text-sm">No payment gateways. The only currency here is gratitude.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>

    <!-- Real Stories -->
    <section class="py-20 bg-latte">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-3xl font-serif font-bold text-center text-coffee mb-16">Real Stories</h2>
        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-latte-50 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                <div class="text-6xl text-latte-100 absolute top-4 left-4 font-serif">"</div>
                <p class="text-gray-700 dark:text-gray-300 relative z-10 italic mb-4">
                    Can I use your app to order a tea, dad?
                </p>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-xl">👧</div>
                    <div>
                        <p class="font-bold text-sm text-coffee">Zola, Age 5</p>
                        <p class="text-xs text-gray-500">Chief Taste Tester</p>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-latte-50 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                <div class="text-6xl text-latte-100 absolute top-4 left-4 font-serif">"</div>
                <p class="text-gray-700 dark:text-gray-300 relative z-10 italic mb-4">
                    It's so much easier to order a coffee for when I get back home. And the barista is super cute too!
                </p>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">👩</div>
                    <div>
                        <p class="font-bold text-sm text-coffee">Magali</p>
                        <p class="text-xs text-gray-500">Wife & Loyal Customer</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>

    <!-- Who is it for -->
    <section class="py-20 bg-white dark:bg-latte-50">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-serif font-bold text-center text-coffee mb-16">Who is My Tiny Café For?</h2>
        <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center p-6">
                <div class="text-5xl mb-4">💻</div>
                <h3 class="font-bold text-lg mb-2">The Remote Work Power Couple</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Send a silent order for a caffeine boost without interrupting the Zoom meeting.</p>
            </div>
            <div class="text-center p-6">
                <div class="text-5xl mb-4">🍽️</div>
                <h3 class="font-bold text-lg mb-2">The "Host with the Most"</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Impress your guests by letting them order their post-meal digestif via a digital menu.</p>
            </div>
            <div class="text-center p-6">
                <div class="text-5xl mb-4">🧸</div>
                <h3 class="font-bold text-lg mb-2">The Playful Parent</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Kids love playing "restaurant." Set up the menu for them and let them take your order.</p>
            </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 bg-latte">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-3xl font-serif font-bold text-center text-coffee mb-12">FAQ</h2>
        <div class="space-y-6">
            <UCard>
                <template #header>
                    <h3 class="font-bold text-coffee">Is it really free?</h3>
                </template>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Yes! My Tiny Café is currently completely free to use.</p>
            </UCard>
            <UCard>
                <template #header>
                    <h3 class="font-bold text-coffee">Can I charge money for the drinks?</h3>
                </template>
                <p class="text-gray-600 dark:text-gray-400 text-sm">No. This app is designed for friends and family. There is no payment processing involved—just the joy of serving a drink to someone you care about.</p>
            </UCard>
            <UCard>
                <template #header>
                    <h3 class="font-bold text-coffee">What can I put on the menu?</h3>
                </template>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Anything! Coffee, tea, snacks, tartines, water... if you can make it in your kitchen, you can put it on your menu.</p>
            </UCard>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-coffee text-latte-100 py-20">
        <div class="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 class="text-3xl lg:text-4xl font-serif font-bold">Ready to open shop?</h2>
            <p class="text-xl opacity-90">Join the community of home baristas today.</p>
            
            <UButton 
                to="/signup" 
                size="xl"
                class="bg-latte-100 hover:bg-white dark:hover:bg-latte-200 text-coffee px-8 py-4 rounded-full font-bold"
            >
                Create Your Café Now
            </UButton>

            <div class="pt-12 border-t border-latte-100/20 mt-12 text-sm opacity-60 space-y-2">
                <p>Made with ❤️ in France for Zola and Magali.</p>
                <p>© 2024 My Tiny Café</p>
                <div class="pt-4">
                    <a href="https://krlx.fr" target="_blank" rel="noopener noreferrer"><h4 class="font-bold uppercase tracking-widest text-xs mb-2">About the Maker</h4></a>
                    <p class="max-w-md mx-auto">
                        I am Alix, I built this to make my wife and daughter happy. I hope it brings a little joy to your home too. I am a freelance frontend developer (preferably in Vue.js / Nuxt.js) with a background in Human-Computer Interaction research. <a href="https://krlx.fr" target="_blank" rel="noopener noreferrer" class="underline">Check out my work</a>.
                    </p>
                </div>
                <div class="pt-8">
                    <p class="text-xs">Guest? <UButton to="/invalid-cafe" variant="link" color="neutral" class="text-latte-100 underline p-0">Find a Café</UButton></p>
                </div>
            </div>
        </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>

<style scoped>
/* Custom font adjustments if needed */
</style>