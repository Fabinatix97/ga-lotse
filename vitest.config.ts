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
    environment: "node",
    reporters: ["basic", "junit"],
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
        "*-api",
        "e2e",
        "performance-test",
        ...VITEST_COVERAGE_EXCLUDES,
      ],
    },
  },
});
