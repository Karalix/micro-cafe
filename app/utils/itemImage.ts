export function itemImage(
    url: string | undefined,
    size: "thumb" | "large",
): string {
    const fallback = `/images-cafe/mug-${size === "thumb" ? 400 : 1024}.webp`;
    if (!url) return fallback;

    const appwriteMatch = url.match(/\/files\/([^/]+)\/view(\?.*)?$/);
    if (appwriteMatch) {
        const queryString = appwriteMatch[2] ?? "";
        const params = new URLSearchParams(queryString.replace(/^\?/, ""));
        const dim = size === "thumb" ? 400 : 1024;
        params.set("width", String(dim));
        params.set("height", String(dim));
        params.set("gravity", "center");
        params.set("quality", size === "thumb" ? "75" : "80");
        params.set("output", "webp");
        return url.replace(/\/view(\?.*)?$/, `/preview?${params.toString()}`);
    }

    const localMatch = url.match(/^\/images-cafe\/([^/.]+)\.png$/);
    if (localMatch) {
        const suffix = size === "thumb" ? "-400" : "-1024";
        return `/images-cafe/${localMatch[1]}${suffix}.webp`;
    }

    return url;
}
