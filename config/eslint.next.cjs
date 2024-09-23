/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "./eslint.base.cjs",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "no-restricted-imports": [
      "warn",
      {
        patterns: [
          {
            group: ["..*"],
            message: "Use absolute imports.",
          },
          {
            group: ["@mui/material", "@mui/material/*"],
            message: "Import from '@mui/joy' instead.",
          },
        ],
        paths: [
          {
            name: "react",
            importNames: ["*", "default"],
            message:
              "Use explicit imports, e.g. import { useState } from 'react'.",
          },
          {
            name: "@mui/joy",
            importNames: ["Link"],
            message:
              "For internal links, use 'InternalLink', 'InternalLinkButton' or 'InternalLinkIconButton'.",
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
        ],
      },
    ],
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
  },
  overrides: [
    {
      files: [
        "next.config.js",
        "vitest.config.ts",
        "src/middleware.ts",
        "src/app/**/{layout,page,loading,not-found,error,global-error,route,template,default}.tsx",
        "src/app/loading.template.tsx",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};

module.exports = config;
