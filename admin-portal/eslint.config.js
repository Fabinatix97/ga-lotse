/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import tseslint from "typescript-eslint";

import { eslintNextConfigs } from "../config/eslint.next.js";

export default tseslint.config(
  ...eslintNextConfigs.app,
  ...eslintNextConfigs.forbidStyleProp,
);
