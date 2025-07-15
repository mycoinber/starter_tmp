// starter/server/api/pages/page-by-slug.ts
import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3';

interface PageResponse {
  redirect?: {
    to: string;
    statusCode?: number;
  };
  [key: string]: any;
}

export const runtime = 'nodejs';

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

  const query = getQuery(event);
  const siteId = query.siteId;
  const slug = query.slug;

  if (!siteId) {
    throw createError({ statusCode: 400, statusMessage: "siteId is required" });
  }

  const config = useRuntimeConfig(event);
  const backendBase = config.server.backHost;

  try {
    const response: PageResponse = await $fetch(`${backendBase}/pages/page-by-slug`, {
      method: "GET",
      params: { siteId, slug },
    });

    // if (response?.redirect?.to) {
    //   console.log('🔥 TRIGGER REDIRECT:', response.redirect);
    //   await sendRedirect(event, response.redirect.to, response.redirect.statusCode || 301);
    //   return; // Ensure function exits after redirect
    // }

    return response;
  } catch (error: any) {
    console.error("[Proxy Error] /pages/page-by-slug:", error?.data || error?.message);
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || 'Failed to fetch page from backend',
    });
  }
});