/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// eslint-disable-next-line no-restricted-imports
import { defineConfig } from "vitest/config";

import { VITEST_COVERAGE_EXCLUDES, VITEST_OUT_DIR } from "./config/vitest.base";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    workspace: [
      "employee-portal",
      "citizen-portal",
      "admin-portal",
      "lib-portal",
      "packages/*",
    ],
    environment: "node",
    reporters: ["default", "junit"],
    outputFile: {
      junit: `${VITEST_OUT_DIR}/junit.xml`,
    },
    coverage: {
      provider: "istanbul",
      all: true,
      reportsDirectory: `${VITEST_OUT_DIR}/coverage`,
      reporter: ["text", "html", "cobertura"],
      include: ["**/src/**/*"],
      exclude: [
        "packages/*-api",
        "e2e",
        "performance-test",
        "**/build",
        "**/.next",
        ...VITEST_COVERAGE_EXCLUDES,
      ],
    },
  },
});
