export default defineNuxtPlugin(() => {
    const router = useRouter();
    router.afterEach((to, from) => {
        if (to.fullPath === from.fullPath) return;
        const fathom = (window as any).fathom;
        if (typeof fathom === "function") {
            fathom("trackPageview");
        }
    });
});
