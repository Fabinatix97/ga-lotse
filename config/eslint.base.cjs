/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

/** @type {import("eslint").Linter.Config} */
const config = {
  plugins: ["@typescript-eslint", "unused-imports"],
  extends: [
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  rules: {
    "no-console": ["warn"],
    "no-debugger": ["warn"],
    "func-style": ["error", "declaration"],
    "no-restricted-imports": [
      "warn",
      {
        patterns: [
          {
            group: ["..*"],
            message: "Use absolute imports.",
          },
        ],
      },
    ],

    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: { attributes: false },
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
  reportUnusedDisableDirectives: true,
};

module.exports = config;
