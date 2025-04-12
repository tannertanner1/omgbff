import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react/jsx-key": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "prefer-const": "off",
      "@next/next/no-async-client-component": "off",
      "react-hooks/rules-of-hooks": "error"
    }
  },
  ...compat.config({
    extends: ["next", "prettier"],
  }),
];

export default eslintConfig;
