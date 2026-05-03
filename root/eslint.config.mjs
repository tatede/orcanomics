import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals.js";

export default defineConfig([
  ...(Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals]),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
