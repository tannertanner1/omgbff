/** @type {import('prettier').Config & import('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */

module.exports = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",

  // @note prettier classes
  plugins: ["prettier-plugin-tailwindcss"],

  // @note prettier imports
  // plugins: ["@ianvs/prettier-plugin-sort-imports"],

  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "^types$",
    "^@/types/(.*)$",
    "^@/data/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/app/(.*)$",
    "^(?!.*[.]css$)[./].*$",
    ".css$"
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  // importOrderSeparation: false,
  // importOrderSortSpecifiers: true,
  // importOrderBuiltinModulesToTop: true,
  // importOrderMergeDuplicateImports: true,
  // importOrderCombineTypeAndValueImports: true
}