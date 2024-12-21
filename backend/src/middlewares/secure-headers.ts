import { secureHeaders } from "hono/secure-headers";

export function configuredSecureHeaders() {
  return secureHeaders({
    contentSecurityPolicy: { defaultSrc: ["'self'", "*"], scriptSrc: ["'self'", "https://*.jsdelivr.net",
      "https://cdn.jsdelivr.net"], styleSrc: ["'self'", "'unsafe-inline'"], imgSrc: ["'self' data:"], connectSrc: ["'self'", "http://localhost:*"], fontSrc: ["*"], objectSrc: ["'none'"], mediaSrc: ["'self'"], frameSrc: ["'none'"] },

    xContentTypeOptions: "nosniff",

    xFrameOptions: "DENY",

    strictTransportSecurity: "max-age=63072000; includeSubDomains; preload",

    referrerPolicy: "strict-origin-when-cross-origin",

    xXssProtection: "1; mode=block",

  });
}
