/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Options, defineConfig } from "tsup";

function defineBaseOptions(watch: boolean, isLegacyPackage = false): Options {
  return {
    outDir: "./build/lib",
    format: ["esm"],
    platform: "neutral",
    clean: !watch, // cleaning in watch mode breaks HMR
    bundle: !watch && !isLegacyPackage,
    splitting: !watch && !isLegacyPackage,
    minify: !watch,
    keepNames: true,
    metafile: true,
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
   * Marks the lib as Next.js client lib, ensuring that a "use client" banner is inserted.
   *
   * As of now, mixed bundling of both client and server components is not yet supported.
   * Enabling this flag will result in all exported components being treated as client components.
   */
  isClientLib?: boolean;
  /**
   * Marks a package as legacy package to enable usage without a barrel file
   */
  isLegacyPackage?: boolean;
}

type ConfigFn = (options: Options) => Options;

export function defineLibConfig(libOptions: LibConfigOptions): ConfigFn {
  return (options: Options) => ({
    ...defineBaseOptions(isWatch(options), libOptions.isLegacyPackage ?? false),
    entry: [
      ...(isWatch(options) ? allSourcesEntry : libOptions.entry),
      excludeUnitTestsPattern,
    ],
    platform: libOptions.platform,
    banner: libOptions.isClientLib ? { js: '"use client";' } : undefined,
    ...options,
  });
}

export const defineApiConfig = defineConfig((options) => ({
  entry: ["src/index.ts"],
  ...defineBaseOptions(false),
  ...options,
}));

type MultiConfigFn = (options: Options) => Options[];

export function defineMultiConfig(...configs: ConfigFn[]): MultiConfigFn {
  return (options: Options) => configs.map((config) => config(options));
}
