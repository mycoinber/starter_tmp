import { defineEventHandler, getQuery, createError, setResponseHeader } from "h3";

export const runtime = "nodejs";

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "s-maxage=600, stale-while-revalidate=300");

  const query = getQuery(event);
  const siteId = query.siteId as string | undefined;

  if (!siteId) {
    throw createError({ statusCode: 400, statusMessage: "siteId is required" });
  }

  const config = useRuntimeConfig(event);
  const backendBase = config.server.backHost;

  try {
    return await $fetch(`${backendBase}/redirect-rules`, {
      method: "GET",
      params: { siteId },
    });
  } catch (error: any) {
    console.error(
      "[Proxy Error] /redirect-rules:",
      error?.data || error?.message || error
    );
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || "Failed to fetch redirect rules",
    });
  }
});
