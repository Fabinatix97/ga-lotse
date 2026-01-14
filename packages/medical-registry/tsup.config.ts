/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineLibConfig } from "../../config/tsup.base";

export default defineLibConfig({
  entry: ["src/index.ts"],
  isClientLib: true,
});
