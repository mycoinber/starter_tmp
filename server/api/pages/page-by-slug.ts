export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const siteId = query.siteId;
    const slug = query.slug;
  
    if (!siteId) {
      throw createError({ statusCode: 400, statusMessage: "siteId is required" });
    }
  
    const config = useRuntimeConfig(event);
    const backendBase = config.server.backHost; // <-- добавим это в nuxt.config.ts
  
    const response = await $fetch(`${backendBase}/pages/page-by-slug`, {
      method: "GET",
      params: {
        siteId,
        slug,
      },
    });
  
    return response;
  });
  