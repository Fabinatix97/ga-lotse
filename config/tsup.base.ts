/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { type Options, defineConfig } from "tsup";

const outDir = "./build/lib";

function defineBaseOptions(watch: boolean, isLegacyPackage = false): Options {
  return {
    outDir: outDir,
    format: ["esm"],
    platform: "neutral",
    clean: !watch, // cleaning in watch mode breaks HMR
    bundle: !watch,
    splitting: !watch,
    minify: !watch,
    keepNames: true,
    metafile: true,
    skipNodeModulesBundle: true,
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
}

type ConfigFn = (options: Options) => Options;

const USE_CLIENT_DIRECTIVE = '"use client";';

function addUseClientDirective(dir: string) {
  const files = fs.readdirSync(dir, {
    recursive: true,
    withFileTypes: true,
  });

  files.forEach((file) => {
    if (file.isFile() && file.name.endsWith(".js")) {
      const fullPath = path.join(file.parentPath, file.name);
      const content = fs.readFileSync(fullPath, "utf-8");
      if (!content.startsWith(USE_CLIENT_DIRECTIVE)) {
        fs.writeFileSync(fullPath, `${USE_CLIENT_DIRECTIVE}\n${content}`);
      }
    }
  });
}

export function defineLibConfig(libOptions: LibConfigOptions): ConfigFn {
  return (options: Options) => ({
    ...defineBaseOptions(isWatch(options)),
    entry: [
      ...(isWatch(options) ? allSourcesEntry : libOptions.entry),
      excludeUnitTestsPattern,
    ],
    platform: libOptions.platform,
    onSuccess:
      libOptions.isClientLib && isWatch(options)
        ? async () => addUseClientDirective(options.outDir ?? outDir)
        : undefined,
    banner:
      libOptions.isClientLib && !isWatch(options)
        ? { js: USE_CLIENT_DIRECTIVE }
        : undefined,
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
