/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { UserConfigExport, configDefaults } from "vitest/config";

export const VITEST_OUT_DIR = "./build/vitest";
export const VITEST_COVERAGE_EXCLUDES = ["**/*.d.ts"];

// https://vitejs.dev/config/
export const VITEST_BASE_CONFIG: UserConfigExport = {
  plugins: [react(), tsconfigPaths()],
  test: {
    exclude: configDefaults.exclude,
    environment: "node",
    reporters: ["default"],
    globals: true,
    coverage: {
      provider: "istanbul",
      all: true,
      reportsDirectory: `${VITEST_OUT_DIR}/coverage`,
      reporter: ["html", "lcov"],
      include: ["src/**/*"],
      exclude: VITEST_COVERAGE_EXCLUDES,
    },
  },
};
