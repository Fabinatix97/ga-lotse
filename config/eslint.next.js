/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

import {
  eslintBaseConfig,
  restrictRelativeImportsPattern,
} from "./eslint.base.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/**
 * Fixes the redefinition of the `import` plugin, which is already defined in `eslint.base.js`
 *
 * @param config {import("eslint").Linter.Config}
 */
function removeImportPluginDefinition(config) {
  if (config.plugins === undefined) {
    return config;
  }

  const { ["import"]: _, ...pluginsWithoutImport } = config.plugins;
  return { ...config, plugins: pluginsWithoutImport };
}

/**
 * Importing mui icons does not work correctly via default imports in lib-portal.
 * Default imports work when used directly in portal Next.js projects.
 * https://github.com/mui/material-ui/issues/35535
 * https://github.com/mui/material-ui/issues/35233
 */
const restrictDefaultIconImportsPattern = {
  group: ["@mui/icons-material/*"],
  message:
    "Use named imports directly from '@mui/icons-material' instead of default imports.",
};

/**
 * @param packageType {"app"|"lib"}
 */
function noRestrictedImportsRuleOptions(packageType) {
  return {
    patterns: [
      ...(packageType === "app" ? [restrictRelativeImportsPattern] : []),
      ...(packageType === "lib" ? [restrictDefaultIconImportsPattern] : []),
      {
        group: ["@mui/material", "@mui/material/*"],
        message: "Import from '@mui/joy' instead.",
      },
    ],

    paths: [
      {
        name: "react",
        importNames: ["*", "default"],
        message: "Use explicit imports, e.g. import { useState } from 'react'.",
      },
      {
        name: "@mui/joy",
        importNames: ["Link"],
        message:
          "For internal links, use 'InternalLink', 'InternalLinkButton' or 'InternalLinkIconButton'. For buttons styled as links, use 'ButtonLink'.",
      },
      {
        name: "next/router",
        importNames: ["useRouter"],
        message: "Import 'useRouter' from 'next/navigation' instead.",
      },
      {
        name: "next/link",
        importNames: ["default"],
        message: "Use 'NavigationLink' from '@eshg/lib-portal' instead.",
      },
      {
        name: "formik",
        importNames: ["Form"],
        message: "Use 'FormPlus' from '@eshg/lib-portal' instead.",
      },
      {
        name: "zustand/middleware",
        importNames: ["devtools"],
        message: "Remove before committing.",
      },
    ],
  };
}

const nextPlugin = compat.config({
  extends: ["next/core-web-vitals", "next/typescript"],
});

const nextBaseConfig = tseslint.config(
  ...nextPlugin,
  ...pluginQuery.configs["flat/recommended"],
  ...eslintBaseConfig,
  {
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "React",
          message:
            "Use explicit type imports, e.g. import { ReactElement } from 'react'.",
        },
      ],

      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message:
            "Access environment variables using the validated 'env' constant from 'env/server' or 'env/client'.",
        },
        {
          object: "crypto",
          property: "randomUUID",
          message: "Use 'import { v4 as uuidv4 } from \"uuid\"' instead.",
        },
      ],

      "react/forbid-elements": [
        "error",
        {
          forbid: [
            {
              element: "form",
              message:
                "use Formik with 'FormPlus' from '@eshg/lib-portal' instead.",
            },
          ],
        },
      ],

      "react/forbid-dom-props": [
        "error",
        {
          forbid: [
            {
              propName: "style",
              message: `Avoid using "style" prop. Prefer using Joy's Box or Stack components and the "sx" prop. Or create a styled-component using the "styled" function.`,
            },
          ],
        },
      ],
      "react/forbid-component-props": [
        "error",
        {
          forbid: [
            {
              propName: "style",
              message: `Avoid using "style" prop. Prefer using the "sx" prop. Or create a styled-component using the "styled" function.`,
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/vitest.config.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
);

export const eslintNextConfigs = {
  app: tseslint.config(
    ...nextBaseConfig,
    {
      rules: {
        "no-restricted-imports": [
          "warn",
          noRestrictedImportsRuleOptions("app"),
        ],
      },
    },
    {
      files: [
        "**/next.config.ts",
        "src/middleware.ts",
        "src/app/**/{layout,page,loading,not-found,error,global-error,route,template,default}.tsx",
        "src/app/loading.template.tsx",
        "src/app/{robots,sitemap}.ts",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ),
  lib: tseslint.config(
    ...nextBaseConfig,
    {
      rules: {
        "no-restricted-imports": [
          "warn",
          noRestrictedImportsRuleOptions("lib"),
        ],
        "@next/next/no-html-link-for-pages": "off", // libs contain no pages
      },
    },
    {
      files: ["src/redirects.ts"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ),
};
