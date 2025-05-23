/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { registerValidationFileMatcher } from "@cronn/vitest-file-snapshots/matcher";

registerValidationFileMatcher({
  baseDir: "src",
});
