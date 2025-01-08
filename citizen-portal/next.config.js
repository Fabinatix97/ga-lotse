/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// validate environment variables on build
import "./src/env/client.js";
import "./src/env/server.js";

// eslint-disable-next-line no-restricted-imports
export { nextConfig as default } from "../config/next.base.js";
