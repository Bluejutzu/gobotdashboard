import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
    overrides: [
      {
        files: [
          "src/lib/supabase/client.ts",
          "src/lib/supabase/middleware.ts",
          "src/lib/supabase/server.ts",
        ],
        rules: {
          "@typescript-eslint/no-non-null-assertion": "off",
        },
      },
    ],
  }),
];

export default eslintConfig;
