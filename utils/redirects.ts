export interface RedirectRule {
  from: string;
  to: string;
  code?: number;
}

interface CompiledRule {
  regex: RegExp;
  params: string[];
}

const HTTP_PATTERN = /^https?:\/\//i;

const escapeSegment = (value: string) =>
  value.replace(/([.+?^=!:${}()|[\]\\])/g, "\\$1");

const compileRule = (pattern: string): CompiledRule => {
  const normalized = normalizePath(pattern);
  if (normalized === "/") {
    return { regex: /^\/$/, params: [] };
  }

  const segments = normalized.replace(/^\//, "").split("/");
  const params: string[] = [];
  const parts = segments.map((segment) => {
    if (segment.startsWith(":")) {
      params.push(segment.slice(1));
      return "([^/]+)";
    }
    return escapeSegment(segment);
  });

  const regex = new RegExp(`^/${parts.join("/")}$`);
  return { regex, params };
};

const injectParams = (target: string, params: Record<string, string>) =>
  target.replace(/:([A-Za-z0-9_]+)/g, (_, name: string) => params[name] ?? "");

const ensureLeadingSlash = (value: string) => {
  if (!value) return "/";
  if (HTTP_PATTERN.test(value)) return value;
  const trimmed = value.trim();
  const prefixed = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return prefixed.length > 1 ? prefixed.replace(/\/+/g, "/").replace(/\/$/, "") : "/";
};

export const normalizePath = (value?: string | null) => {
  if (!value) return "/";
  let cleaned = value.split(/[?#]/)[0]?.trim() || "/";
  if (!cleaned.startsWith("/")) cleaned = `/${cleaned}`;
  if (cleaned.length > 1 && cleaned.endsWith("/")) cleaned = cleaned.replace(/\/+$/, "");
  return cleaned || "/";
};

export const resolveRedirectTarget = (
  currentPath: string,
  rules: RedirectRule[]
): { to: string; code: number } | null => {
  if (!Array.isArray(rules) || rules.length === 0) return null;
  const normalizedPath = normalizePath(currentPath);

  for (const rule of rules) {
    if (!rule?.from || !rule?.to) continue;
    const { regex, params } = compileRule(rule.from);
    const match = normalizedPath.match(regex);
    if (!match) continue;

    const values: Record<string, string> = {};
    params.forEach((name, idx) => {
      values[name] = match[idx + 1];
    });

    const resolvedTarget = ensureLeadingSlash(injectParams(rule.to, values));
    const status = typeof rule.code === "number" ? rule.code : 302;

    return { to: resolvedTarget, code: status };
  }

  return null;
};
