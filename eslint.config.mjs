import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Eslint rules should be added to this file.
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "error",
      "@typescript-eslint/no-wrapper-object-types": "error"
    },
  },
];