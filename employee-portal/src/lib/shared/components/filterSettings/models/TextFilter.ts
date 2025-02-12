/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinitionBase } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValueBase } from "@/lib/shared/components/filterSettings/models/FilterValue";

export interface TextFilterDefinition extends FilterDefinitionBase {
  type: "Text";
}

export interface TextFilterValue extends FilterValueBase {
  type: "Text";
  value: string;
}
