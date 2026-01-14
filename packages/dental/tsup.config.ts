/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineLibConfig, defineMultiConfig } from "../../config/tsup.base";

export default defineMultiConfig(
  defineLibConfig({
    entry: ["src/index.ts"],
    isClientLib: true,
  }),
  defineLibConfig({ entry: ["src/server.ts"] }),
);
