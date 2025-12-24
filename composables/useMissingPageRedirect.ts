import { useNuxtApp } from "#imports";
import { normalizePath, resolveRedirectTarget } from "~/utils/redirects";
import type { RedirectRule } from "~/utils/redirects";

interface Options {
  siteId: string;
  requestedPath: string;
  fallbackPath?: string;
}

interface RedirectResult {
  to: string;
  code: number;
}

const FALLBACK_STATUS = 302;

export const useMissingPageRedirect = async ({
  siteId,
  requestedPath,
  fallbackPath = "/",
}: Options): Promise<RedirectResult | null> => {
  if (!siteId) return null;

  const nuxtApp = useNuxtApp();
  const axiosInstance = (nuxtApp as any)?.$axios;
  const normalizedPath = normalizePath(requestedPath);

  if (!axiosInstance) {
    console.warn("[Redirect rules] axios instance is unavailable");
    return null;
  }

  try {
    const response = await axiosInstance.get("/redirect-rules", {
      params: { siteId },
    });
    const rules: RedirectRule[] = Array.isArray(response.data)
      ? response.data
      : [];
    const match = resolveRedirectTarget(normalizedPath, rules);
    if (match) {
      return match;
    }
  } catch (error: any) {
    const message = error?.response?.data?.error || error?.message || error;
    console.error("[Redirect rules] Failed to fetch list:", message);
  }

  const normalizedFallback = normalizePath(fallbackPath);
  if (normalizedFallback && normalizedFallback !== normalizedPath) {
    return { to: normalizedFallback, code: FALLBACK_STATUS };
  }

  return null;
};
