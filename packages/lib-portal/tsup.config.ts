/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineLibConfig, defineMultiConfig } from "../../config/tsup.base";

export default defineMultiConfig(
  defineLibConfig({
    entry: ["src/**/*.ts", "src/**/*.tsx", "!src/universal.ts"],
    isLegacyPackage: true,
  }),
  defineLibConfig({
    entry: ["src/universal.ts"],
  }),
);
