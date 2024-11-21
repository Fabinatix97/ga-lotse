/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/base";
import {
  ApiAttributeSelection,
  ApiTableColumnHeader,
} from "@eshg/employee-portal-api/statistics";

import { mapAttributeSelectionToKey } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { getAttributeLabel } from "@/lib/businessModules/statistics/components/evaluations/getAttributeLabel";

type ApiAttribute = ApiTableColumnHeader["attribute"];

/** All non-nested ApiAttributes */
type FlatApiAttribute = Exclude<
  ApiAttribute,
  { type: "CentralFileIdAttribute" }
>;

export type FlatAttribute = FlatApiAttribute & {
  key: string;
  businessModule: ApiBusinessModule;
};

function mapTableColumnHeaderToAttributeSelection(
  header: ApiTableColumnHeader,
): ApiAttributeSelection {
  return {
    businessModuleAttributeCode: header.attribute.code,
    baseModuleAttributeCode:
      header.attribute.type === "CentralFileIdAttribute"
        ? header.attribute.baseAttribute.code
        : undefined,
    businessModuleName: header.businessModule,
    dataSourceId: header.dataSourceId,
  };
}

export function mapTableColumnHeadersToFlatAttributes(
  tableColumnHeaders: ApiTableColumnHeader[],
): FlatAttribute[] {
  return tableColumnHeaders.map((header) => {
    const key = mapAttributeSelectionToKey(
      mapTableColumnHeaderToAttributeSelection(header),
    );
    const businessModule = header.businessModule;

    if (header.attribute.type === "CentralFileIdAttribute") {
      if (header.attribute.baseAttribute.type === "CentralFileIdAttribute") {
        throw new Error(
          "Base attributes must not be of type CentralFileIdAttribute",
        );
      }
      return {
        ...header.attribute.baseAttribute,
        name: getAttributeLabel(
          header.attribute,
          header.attribute.baseAttribute,
        ),
        key,
        businessModule: mapToApiBusinessModule(businessModule),
      } satisfies FlatAttribute;
    }
    return {
      ...header.attribute,
      key,
      businessModule: mapToApiBusinessModule(businessModule),
    } satisfies FlatAttribute;
  });
}
