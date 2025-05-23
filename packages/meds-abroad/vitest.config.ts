/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mergeConfig } from "vitest/config";

// eslint-disable-next-line no-restricted-imports
import { VITEST_BASE_CONFIG } from "../../config/vitest.base";

export default mergeConfig(VITEST_BASE_CONFIG, {
  test: {
    setupFiles: ["vitest-setup.ts"],
  },
});
