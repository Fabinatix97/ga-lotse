/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Options, defineConfig } from "tsup";

const baseOptions: Options = {
  outDir: "./build/lib",
  format: ["esm"],
  platform: "neutral",
  clean: true,
};
const excludeUnitTestsPattern = "!src/**/*.test.*";

export function defineLibConfig(entry: string[]) {
  return defineConfig((options) => ({
    entry: [...entry, excludeUnitTestsPattern],
    ...baseOptions,
    ...options,
  }));
}

export const defineApiConfig = defineConfig((options) => ({
  entry: ["src/index.ts"],
  ...baseOptions,
  ...options,
}));
