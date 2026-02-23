import { defineEventHandler } from "h3";
import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  if (event.path !== "/robots.txt") return;

  const runtimeConfig = useRuntimeConfig();
  const backHost = runtimeConfig.server.backHost || "http://localhost:3077";
  const siteId = runtimeConfig.server.siteId || runtimeConfig.public.siteId || "default-id";

  const host = event.node.req.headers["host"] || "localhost:3000";
  const proto =
    event.node.req.headers["x-forwarded-proto"] ||
    (event.node.req.connection.encrypted ? "https" : "http");
  const baseUrl = `${proto}://${host}`;
  const siteUrl = baseUrl;

  event.node.res.setHeader("Content-Type", "text/plain; charset=utf-8");
  event.node.res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );

  try {
    const robotsContent = await $fetch(`${backHost}/sites/robots?siteId=${siteId}`);
    const robotsText = typeof robotsContent === "string" ? robotsContent.trim() : "";

    const finalContent = robotsText.includes("Sitemap")
      ? robotsText
      : `${robotsText}\nSitemap: ${siteUrl}/sitemap.xml`.trim();

    event.node.res.end(finalContent);
  } catch (error) {
    console.error("Failed to fetch robots.txt content:", error);
    const defaultContent = `
User-agent: *
Disallow: /
Sitemap: ${siteUrl}/sitemap.xml
    `.trim();

    event.node.res.end(defaultContent);
  }
});
