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

interface LibConfigOptions {
  entry: string[];
  platform?: Options["platform"];
  /**
   * Marks the lib as Next.js lib, ensuring that a "use client" banner is inserted.
   *
   * As of now, mixed bundling of both client and server components is not yet supported.
   * Enabling this flag will result in all exported components being treated as client components.
   */
  isNextJsLib?: boolean;
}

export function defineLibConfig(libOptions: LibConfigOptions) {
  return defineConfig((options) => ({
    ...baseOptions,
    entry: [...libOptions.entry, excludeUnitTestsPattern],
    platform: libOptions.platform,
    banner: libOptions.isNextJsLib ? { js: '"use client";' } : undefined,
    ...options,
  }));
}

export const defineApiConfig = defineConfig((options) => ({
  entry: ["src/index.ts"],
  ...baseOptions,
  ...options,
}));
