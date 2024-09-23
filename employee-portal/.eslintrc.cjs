/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["../config/eslint.next.cjs"],
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      typescript: {
        project: "./employee-portal/tsconfig.json",
      },
    },
  },
};

module.exports = config;
