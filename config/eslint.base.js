/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export const restrictRelativeImportsPattern = {
  group: ["..*"],
  message: "Use absolute imports.",
};

export const eslintBaseConfig = tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    plugins: {
      /**
       * Could be replaced by the more performant eslint-plugin-import-x
       * after the no-default-export rule for TypeScript is fixed
       *
       * See https://github.com/un-ts/eslint-plugin-import-x/issues/144
       */
      import: eslintPluginImport,
      "unused-imports": eslintPluginUnusedImports,
    },
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      parserOptions: {
        projectService: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    rules: {
      "no-console": ["warn"],
      "no-debugger": ["warn"],
      "func-style": ["error", "declaration"],

      "no-restricted-imports": [
        "warn",
        {
          patterns: [restrictRelativeImportsPattern],
        },
      ],

      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "import/no-default-export": "error",
    },
  },
);
