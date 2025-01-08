/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// validate environment variables on build
// eslint-disable-next-line no-restricted-imports
import { nextConfig } from "../config/next.base.js";

import "./src/env/client.js";
import "./src/env/server.js";

export default {
  ...nextConfig,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/org-units",
        permanent: true,
      },
    ];
  },
};
