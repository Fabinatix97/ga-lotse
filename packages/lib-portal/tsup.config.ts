/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineLibConfig, defineMultiConfig } from "../../config/tsup.base";

export default defineMultiConfig(
  defineLibConfig({
    entry: ["src/index.ts"],
    isClientLib: true,
  }),
  defineLibConfig({
    entry: ["src/universal.ts", "src/server.ts"],
  }),
);
