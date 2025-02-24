/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineLibConfig } from "../../config/tsup.base";

export default defineLibConfig(
  ["src/index.ts", "src/extend-expect.ts"],
  "node",
);
