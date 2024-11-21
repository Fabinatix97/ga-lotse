/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBaseDataSourceAttribute,
  ApiBusinessDataSourceAttribute,
} from "@eshg/employee-portal-api/statistics";
import { isNonNullish } from "remeda";

export function getAttributeLabel(
  attribute: Pick<ApiBusinessDataSourceAttribute, "name">,
  baseAttribute?: Pick<ApiBaseDataSourceAttribute, "name">,
) {
  return isNonNullish(baseAttribute)
    ? `${attribute.name}: ${baseAttribute.name}`
    : attribute.name;
}
