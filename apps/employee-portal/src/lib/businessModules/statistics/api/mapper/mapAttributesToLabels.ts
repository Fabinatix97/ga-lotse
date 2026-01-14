/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessDataAttributeWithName } from "@eshg/statistics-api";

import { getAttributeLabel } from "@/lib/businessModules/statistics/components/evaluations/getAttributeLabel";

export function mapAttributesToLabels(
  dataAttributes: ApiBusinessDataAttributeWithName[],
): string[] {
  return dataAttributes.flatMap((it) => {
    if (it.baseDataAttributes.length === 0) {
      return [getAttributeLabel(it)];
    }
    return it.baseDataAttributes.map((bAttr) => getAttributeLabel(it, bAttr));
  });
}
