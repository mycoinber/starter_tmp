import { defineEventHandler } from "h3";
import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  if (event.path === "/robots.txt") {
    const runtimeConfig = useRuntimeConfig(); // Получаем runtimeConfig

    const backHost = runtimeConfig.public.backHost || "http://localhost:3077";
    const siteId = runtimeConfig.public.siteId || "default-id";

    const host = event.node.req.headers["host"] || "localhost:3000";
    const proto =
      event.node.req.headers["x-forwarded-proto"] ||
      (event.node.req.connection.encrypted ? "https" : "http");
    const baseUrl = `${proto}://${host}`;
    const siteUrl = baseUrl;

    try {
      const robotsContent = await $fetch(
        `${backHost}/sites/robots?siteId=${siteId}`
      );
      const finalContent = robotsContent.includes("Sitemap")
        ? robotsContent
        : `${robotsContent.trim()}\nSitemap: ${siteUrl}/sitemap.xml`;

      event.node.res.setHeader("Content-Type", "text/plain");
      event.node.res.end(finalContent);
    } catch (error) {
      console.error("Failed to fetch robots.txt content:", error);
      const defaultContent = `
User-agent: *
Disallow: /
Sitemap: ${siteUrl}/sitemap.xml
      `.trim();

      event.node.res.setHeader("Content-Type", "text/plain");
      event.node.res.end(defaultContent);
    }
  }
});
