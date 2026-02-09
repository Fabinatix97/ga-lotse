/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { registerValidationFileMatchers } from "@cronn/vitest-file-snapshots/register";

registerValidationFileMatchers({
  testDir: "src",
});
