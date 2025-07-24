/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineConfig } from "vite";
import path from "path";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  preview: {
    port: 3004,
    strictPort: true,
    host: true,
    allowedHosts: ["host.docker.internal"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "build/dist",
  },
})
