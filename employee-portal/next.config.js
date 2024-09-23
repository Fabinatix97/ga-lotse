/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import nextPwa from "@ducanh2912/next-pwa";
import crypto from "crypto";
import fs from "fs";

// eslint-disable-next-line no-restricted-imports
import { nextConfig } from "../config/next.base.js";

// validate environment variables on build
import "./src/env/client.js";
import "./src/env/server.js";

function getHash(path) {
  if (typeof path !== "string") {
    throw new Error("path must be a string");
  }
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(path));
  return hash.digest("hex");
}

const withPwa = nextPwa({
  cacheStartUrl: false,
  dynamicStartUrl: false,
  dest: "public",
  customWorkerSrc: "src/serviceWorker/sw",
  register: false,
  reloadOnOnline: true,
  workboxOptions: {
    additionalManifestEntries: [
      { url: "/manifest.json", revision: getHash("src/app/manifest.json") },
      {
        url: "/favicon-16x16.png",
        revision: getHash("public/favicon-16x16.png"),
      },
      {
        url: "/favicon-32x32.png",
        revision: getHash("public/favicon-32x32.png"),
      },
      {
        url: "/icon-256x256.png",
        revision: getHash("public/icon-256x256.png"),
      },
    ],
    maximumFileSizeToCacheInBytes: 67_108_864, // 64MB
    runtimeCaching: [],
    skipWaiting: true,
  },
});

const nextConfigWithPwa = withPwa(nextConfig);

export default nextConfigWithPwa;
