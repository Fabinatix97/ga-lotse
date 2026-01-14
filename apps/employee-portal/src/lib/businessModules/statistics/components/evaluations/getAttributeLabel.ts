/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonNullish } from "remeda";

import {
  ApiBaseDataSourceAttribute,
  ApiBusinessDataSourceAttribute,
} from "@eshg/statistics-api";

export function getAttributeLabel(
  attribute: Pick<ApiBusinessDataSourceAttribute, "name">,
  baseAttribute?: Pick<ApiBaseDataSourceAttribute, "displayName">,
) {
  return isNonNullish(baseAttribute)
    ? baseAttribute.displayName
    : attribute.name;
}
