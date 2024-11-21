/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import tseslint from "typescript-eslint";

import { eslintNextConfigs } from "../config/eslint.next.js";

export default tseslint.config(
  ...eslintNextConfigs.lib,
  ...eslintNextConfigs.forbidStyleProp,
);
