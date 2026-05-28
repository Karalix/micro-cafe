export default defineNuxtPlugin(() => {
    const router = useRouter();
    router.afterEach((to, from) => {
        if (to.fullPath === from.fullPath) return;
        const paq = (window as any)._paq;
        if (!paq) return;
        paq.push(["setCustomUrl", window.location.origin + to.fullPath]);
        paq.push(["setDocumentTitle", document.title]);
        paq.push(["trackPageView"]);
    });
});
