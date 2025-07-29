// composables/usePageData.ts
import { useNuxtApp, useAsyncData } from "#app";

export function usePageData(siteId: string, slug: string | null) {
    const { $axios } = useNuxtApp() as any;

    // Вынесли саму функцию запроса
    const fetchPage = async () => {
        const params: Record<string, any> = { siteId };
        if (slug) params.slug = slug;
        try {
            const response = await $axios.get("/pages/page-by-slug", { params });
            return response.data;
        } catch (error: any) {
            console.error("Ошибка запроса:", error);
            return {};
        }
    };

    // Вынесли асинхронное получение данных
    const asyncData = useAsyncData(
        `page-${slug || "home"}-${siteId}`,
        fetchPage,
        { server: true }
    );

    return asyncData;
}
