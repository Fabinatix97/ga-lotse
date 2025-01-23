/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import tseslint from "typescript-eslint";

import { eslintNextConfigs } from "../../config/eslint.next.js";

export default tseslint.config(
  ...eslintNextConfigs.lib,
  ...eslintNextConfigs.forbidStyleProp,
);
