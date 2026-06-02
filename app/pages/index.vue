<template>
  <div class="min-h-screen bg-latte text-gray-700 font-sans selection:bg-latte-200 selection:text-coffee">

    <!-- Navbar -->
    <nav class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div class="text-xl font-bold text-coffee flex items-center gap-2">
        <UIcon name="i-heroicons-cup-saucer" class="w-6 h-6" />
        <span>My Tiny Café</span>
      </div>
      <div class="flex items-center gap-4">
        <LanguageSwitcher />
        <UButton
          to="/login"
          variant="ghost"
          color="neutral"
          :label="$t('landing.nav.login')"
          class="hidden sm:flex hover:bg-latte-100"
        />
        <UButton
          to="/signup"
          color="primary"
          variant="solid"
          :label="$t('landing.nav.openCafe')"
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
            <i18n-t keypath="landing.hero.title" tag="h1" class="text-5xl lg:text-7xl font-serif font-bold text-coffee leading-tight">
              <template #highlight><span class="text-coffee-500">{{ $t('landing.hero.titleHighlight') }}</span></template>
            </i18n-t>
            <p class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {{ $t('landing.hero.subtitle') }}
              <br class="hidden lg:block" />
              <span class="font-semibold text-coffee-500">{{ $t('landing.hero.subtitleEmphasis') }}</span>
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <UButton
                to="/signup"
                size="xl"
                class="bg-coffee-500 hover:bg-coffee-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 justify-center"
              >
                {{ $t('landing.hero.ctaPrimary') }}
              </UButton>
              <UButton
                to="/demo"
                size="xl"
                variant="ghost"
                color="neutral"
                class="text-coffee-500 hover:bg-latte-100 px-8 py-4 rounded-full justify-center"
              >
                {{ $t('landing.hero.ctaDemo') }}
              </UButton>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 italic">
              {{ $t('landing.hero.noCreditCard') }}
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
                                <p class="text-xs font-semibold text-coffee">{{ $t('landing.mockup.notifTitle') }}</p>
                                <p class="text-xs text-gray-600">{{ $t('landing.mockup.notifOrder') }}</p>
                            </div>
                            <span class="text-[10px] text-gray-400 ml-auto">{{ $t('landing.mockup.now') }}</span>
                        </div>

                        <!-- App Content Mock -->
                        <div class="p-4 mt-4">
                            <h3 class="font-serif text-xl text-coffee font-bold mb-3 ml-1">{{ $t('landing.mockup.menu') }}</h3>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="border-2 border-coffee-500 overflow-hidden bg-white dark:bg-latte-50 flex flex-col">
                                    <div class="aspect-square w-full bg-latte-100">
                                        <img src="/images-cafe/latte-400.webp" alt="Latte" width="140" height="140" loading="lazy" decoding="async" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex items-center justify-between gap-1 px-2 py-1 border-t-2 border-coffee-500">
                                        <div class="font-medium text-coffee text-xs truncate">{{ $t('landing.mockup.latte') }}</div>
                                        <div class="text-coffee-600 text-[10px] shrink-0">{{ $t('landing.mockup.lattePrice') }}</div>
                                    </div>
                                </div>
                                <div class="border-2 border-coffee-500 overflow-hidden bg-white dark:bg-latte-50 flex flex-col">
                                    <div class="aspect-square w-full bg-latte-100">
                                        <img src="/images-cafe/gaiwan-400.webp" alt="Matcha" width="140" height="140" loading="lazy" decoding="async" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex items-center justify-between gap-1 px-2 py-1 border-t-2 border-coffee-500">
                                        <div class="font-medium text-coffee text-xs truncate">{{ $t('landing.mockup.matcha') }}</div>
                                        <div class="text-coffee-600 text-[10px] shrink-0">5€</div>
                                    </div>
                                </div>
                                <div class="border-2 border-coffee-500 overflow-hidden bg-white dark:bg-latte-50 flex flex-col">
                                    <div class="aspect-square w-full bg-latte-100">
                                        <img src="/images-cafe/the-400.webp" alt="Tea" width="140" height="140" loading="lazy" decoding="async" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex items-center justify-between gap-1 px-2 py-1 border-t-2 border-coffee-500">
                                        <div class="font-medium text-coffee text-xs truncate">{{ $t('landing.mockup.tea') }}</div>
                                        <div class="text-coffee-600 text-[10px] shrink-0">{{ $t('landing.mockup.teaPrice') }}</div>
                                    </div>
                                </div>
                                <div class="border-2 border-coffee-500 overflow-hidden bg-white dark:bg-latte-50 flex flex-col">
                                    <div class="aspect-square w-full bg-latte-100">
                                        <img src="/images-cafe/cookie-400.webp" alt="Cookie" width="140" height="140" loading="lazy" decoding="async" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex items-center justify-between gap-1 px-2 py-1 border-t-2 border-coffee-500">
                                        <div class="font-medium text-coffee text-xs truncate">{{ $t('landing.mockup.cookie') }}</div>
                                        <div class="text-coffee-600 text-[10px] shrink-0">{{ $t('landing.mockup.cookiePrice') }}</div>
                                    </div>
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
          <h2 class="text-sm font-bold tracking-widest text-coffee-500 uppercase">{{ $t('landing.valueProp.eyebrow') }}</h2>
          <h3 class="text-3xl lg:text-4xl font-serif font-bold text-coffee">
            {{ $t('landing.valueProp.heading') }}
          </h3>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-start">
            <div class="bg-latte-50 p-8 rounded-3xl h-full">
                <div class="text-4xl mb-4">😫</div>
                <h4 class="font-bold text-lg mb-2 text-coffee">{{ $t('landing.valueProp.problemTitle') }}</h4>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ $t('landing.valueProp.problemText') }}
                </p>
            </div>
            <div class="bg-green-soft p-8 rounded-3xl h-full">
                <div class="text-4xl mb-4">✨</div>
                <h4 class="font-bold text-lg mb-2 text-coffee">{{ $t('landing.valueProp.solutionTitle') }}</h4>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ $t('landing.valueProp.solutionText') }}
                </p>
            </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-latte">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl lg:text-4xl font-serif font-bold text-center text-coffee mb-16">
          {{ $t('landing.howItWorks.title') }}
        </h2>

        <div class="grid md:grid-cols-3 gap-12">
          <!-- Step 1 -->
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-coffee-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-3">
              <UIcon name="i-heroicons-clipboard-document-list" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-coffee">{{ $t('landing.howItWorks.step1Title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t('landing.howItWorks.step1Text') }}
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-coffee-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg -rotate-3">
              <UIcon name="i-heroicons-qr-code" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-coffee">{{ $t('landing.howItWorks.step2Title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t('landing.howItWorks.step2Text') }}
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-coffee-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg rotate-3">
              <UIcon name="i-heroicons-bell-alert" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-coffee">{{ $t('landing.howItWorks.step3Title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t('landing.howItWorks.step3Text') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-white dark:bg-latte-50">
      <div class="max-w-5xl mx-auto px-6">
        <div class="bg-coffee dark:bg-latte-100 rounded-[3rem] p-8 lg:p-16 text-white shadow-2xl">
            <h2 class="text-3xl font-serif font-bold mb-12 text-center">{{ $t('landing.features.title') }}</h2>
            <div class="grid md:grid-cols-2 gap-x-12 gap-y-8">
                <div class="flex gap-4">
                    <UIcon name="i-lucide-coffee" class="w-6 h-6 text-green-pale shrink-0" />
                    <div>
                        <h4 class="font-bold text-lg mb-1">{{ $t('landing.features.feature1Title') }}</h4>
                        <p class="text-gray-300 text-sm">{{ $t('landing.features.feature1Text') }}</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <UIcon name="i-heroicons-device-phone-mobile" class="w-6 h-6 text-green-pale shrink-0" />
                    <div>
                        <h4 class="font-bold text-lg mb-1">{{ $t('landing.features.feature2Title') }}</h4>
                        <p class="text-gray-300 text-sm">{{ $t('landing.features.feature2Text') }}</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <UIcon name="i-heroicons-arrow-down-tray" class="w-6 h-6 text-green-pale shrink-0" />
                    <div>
                        <h4 class="font-bold text-lg mb-1">{{ $t('landing.features.feature3Title') }}</h4>
                        <p class="text-gray-300 text-sm">{{ $t('landing.features.feature3Text') }}</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <UIcon name="i-heroicons-heart" class="w-6 h-6 text-green-pale shrink-0" />
                    <div>
                        <h4 class="font-bold text-lg mb-1">{{ $t('landing.features.feature4Title') }}</h4>
                        <p class="text-gray-300 text-sm">{{ $t('landing.features.feature4Text') }}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>

    <!-- Real Stories -->
    <section class="py-20 bg-latte">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-3xl font-serif font-bold text-center text-coffee mb-16">{{ $t('landing.stories.title') }}</h2>
        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-white dark:bg-latte-50 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                <div class="text-6xl text-latte-100 absolute top-4 left-4 font-serif">"</div>
                <p class="text-gray-700 dark:text-gray-300 relative z-10 italic mb-4">
                    {{ $t('landing.stories.quote1') }}
                </p>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-xl">👧</div>
                    <div>
                        <p class="font-bold text-sm text-coffee">{{ $t('landing.stories.quote1Name') }}</p>
                        <p class="text-xs text-gray-500">{{ $t('landing.stories.quote1Role') }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-latte-50 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                <div class="text-6xl text-latte-100 absolute top-4 left-4 font-serif">"</div>
                <p class="text-gray-700 dark:text-gray-300 relative z-10 italic mb-4">
                    {{ $t('landing.stories.quote2') }}
                </p>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">👩</div>
                    <div>
                        <p class="font-bold text-sm text-coffee">{{ $t('landing.stories.quote2Name') }}</p>
                        <p class="text-xs text-gray-500">{{ $t('landing.stories.quote2Role') }}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>

    <!-- Who is it for -->
    <section class="py-20 bg-white dark:bg-latte-50">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-serif font-bold text-center text-coffee mb-16">{{ $t('landing.audience.title') }}</h2>
        <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center p-6">
                <div class="text-5xl mb-4">💻</div>
                <h3 class="font-bold text-lg mb-2">{{ $t('landing.audience.card1Title') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('landing.audience.card1Text') }}</p>
            </div>
            <div class="text-center p-6">
                <div class="text-5xl mb-4">🍽️</div>
                <h3 class="font-bold text-lg mb-2">{{ $t('landing.audience.card2Title') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('landing.audience.card2Text') }}</p>
            </div>
            <div class="text-center p-6">
                <div class="text-5xl mb-4">🧸</div>
                <h3 class="font-bold text-lg mb-2">{{ $t('landing.audience.card3Title') }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('landing.audience.card3Text') }}</p>
            </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 bg-latte">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-3xl font-serif font-bold text-center text-coffee mb-12">{{ $t('landing.faq.title') }}</h2>
        <div class="space-y-6">
            <UCard>
                <template #header>
                    <h3 class="font-bold text-coffee">{{ $t('landing.faq.q1') }}</h3>
                </template>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ $t('landing.faq.a1') }}</p>
            </UCard>
            <UCard>
                <template #header>
                    <h3 class="font-bold text-coffee">{{ $t('landing.faq.q2') }}</h3>
                </template>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ $t('landing.faq.a2') }}</p>
            </UCard>
            <UCard>
                <template #header>
                    <h3 class="font-bold text-coffee">{{ $t('landing.faq.q3') }}</h3>
                </template>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ $t('landing.faq.a3') }}</p>
            </UCard>
        </div>
      </div>
    </section>

    <!-- Open Source -->
    <section class="py-20 bg-white dark:bg-latte-50">
      <div class="max-w-4xl mx-auto px-6 text-center space-y-8">
        <div class="inline-flex items-center justify-center p-4 bg-gray-900 rounded-full shadow-lg mb-4">
            <UIcon name="i-simple-icons-github" class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-3xl font-serif font-bold text-coffee">{{ $t('landing.openSource.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {{ $t('landing.openSource.text') }}
        </p>
        <UButton
            to="https://github.com/Karalix/micro-cafe"
            target="_blank"
            variant="solid"
            size="xl"
            class="bg-gray-900 hover:bg-gray-800 text-white"
        >
            <UIcon name="i-simple-icons-github" class="w-5 h-5 mr-2" />
            {{ $t('landing.openSource.button') }}
        </UButton>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-coffee text-latte-100 py-20">
        <div class="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 class="text-3xl lg:text-4xl font-serif font-bold">{{ $t('landing.footer.title') }}</h2>
            <p class="text-xl opacity-90">{{ $t('landing.footer.subtitle') }}</p>

            <UButton
                to="/signup"
                size="xl"
                class="bg-latte-100 hover:bg-white dark:hover:bg-latte-200 text-coffee px-8 py-4 rounded-full font-bold"
            >
                {{ $t('landing.footer.cta') }}
            </UButton>

            <div class="pt-12 border-t border-latte-100/20 mt-12 text-sm opacity-60 space-y-2">
                <p>{{ $t('landing.footer.madeWith') }}</p>
                <p>{{ $t('landing.footer.copyright') }}</p>
                <div class="pt-4">
                    <a href="https://krlx.fr" target="_blank" rel="noopener noreferrer"><h4 class="font-bold uppercase tracking-widest text-xs mb-2">{{ $t('landing.footer.aboutMakerTitle') }}</h4></a>
                    <i18n-t keypath="landing.footer.aboutMakerText" tag="p" class="max-w-md mx-auto">
                        <template #link><a href="https://krlx.fr" target="_blank" rel="noopener noreferrer" class="underline">{{ $t('landing.footer.aboutMakerLink') }}</a></template>
                    </i18n-t>
                </div>
                <div class="pt-8">
                    <p class="text-xs">{{ $t('landing.footer.guest') }} <UButton to="/invalid-cafe" variant="link" color="neutral" class="text-latte-100 underline p-0">{{ $t('landing.footer.findCafe') }}</UButton></p>
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
