/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Options, defineConfig } from "tsup";

function defineBaseOptions(watch: boolean): Options {
  return {
    outDir: "./build/lib",
    format: ["esm"],
    platform: "neutral",
    clean: !watch, // cleaning in watch mode breaks HMR
    bundle: !watch,
    splitting: !watch,
    minify: !watch,
    keepNames: true,
  };
}

function isWatch(options: Options): boolean {
  return options.watch === true;
}

const allSourcesEntry = ["src/**/*"];
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
    ...defineBaseOptions(isWatch(options)),
    entry: [
      ...(isWatch(options) ? allSourcesEntry : libOptions.entry),
      excludeUnitTestsPattern,
    ],
    platform: libOptions.platform,
    banner: libOptions.isNextJsLib ? { js: '"use client";' } : undefined,
    ...options,
  }));
}

export const defineApiConfig = defineConfig((options) => ({
  entry: ["src/index.ts"],
  ...defineBaseOptions(false),
  ...options,
}));
