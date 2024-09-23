/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

const nextConfig = require("../config/eslint.next.cjs");
const [_, noRestrictedImportsOptions] =
  nextConfig.rules["no-restricted-imports"];

/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["../config/eslint.next.cjs"],
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      typescript: {
        project: "./lib-portal/tsconfig.json",
      },
    },
  },
  rules: {
    "no-restricted-imports": [
      "warn",
      {
        ...noRestrictedImportsOptions,
        patterns: [
          ...noRestrictedImportsOptions.patterns.filter(
            (pattern) => !pattern.group.includes("..*"), // filter absolute imports rule
          ),
          {
            // Importing mui icons does not work correctly via default imports in lib-portal.
            // Default imports work when used directly in portal Next.js projects.
            // https://github.com/mui/material-ui/issues/35535
            // https://github.com/mui/material-ui/issues/35233
            group: ["@mui/icons-material/*"],
            message:
              "Use named imports directly from '@mui/icons-material' instead of default imports.",
          },
        ],
      },
    ],
  },
};

module.exports = config;
