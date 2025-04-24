/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "./FilterDefinition";
import { FilterValueBase } from "./FilterValue";

export interface TextFilterDefinition extends FilterDefinitionBase {
  type: "Text";
}

export interface TextFilterValue extends FilterValueBase {
  type: "Text";
  value: string;
}
