/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";
import {
  ApiAttributeSelection,
  ApiDataPrivacyCategory,
  ApiTableColumnHeader,
} from "@eshg/statistics-api";

import { mapAttributeSelectionToKey } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";

type ApiAttribute = ApiTableColumnHeader["attribute"];

/** All non-nested ApiAttributes */
type FlatApiAttribute = Exclude<
  ApiAttribute,
  { type: "BaseModuleIdAttribute" }
>;

export type FlatAttribute = FlatApiAttribute & {
  key: string;
  businessModule: ApiBusinessModule;
  dataPrivacyCategory?: ApiDataPrivacyCategory;
};

function mapTableColumnHeaderToAttributeSelection(
  header: ApiTableColumnHeader,
): ApiAttributeSelection {
  return {
    businessModuleAttributeCode: header.attribute.code,
    baseModuleAttributeCode:
      header.attribute.type === "BaseModuleIdAttribute"
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

    if (header.attribute.type === "BaseModuleIdAttribute") {
      if (header.attribute.baseAttribute.type === "BaseModuleIdAttribute") {
        throw new Error(
          "Base attributes must not be of type BaseModuleIdAttribute",
        );
      }
      return {
        ...header.attribute.baseAttribute,
        name: header.displayName,
        key,
        businessModule: mapToApiBusinessModule(businessModule),
        dataPrivacyCategory: header.dataPrivacyCategory,
      } satisfies FlatAttribute;
    }
    return {
      ...header.attribute,
      key,
      businessModule: mapToApiBusinessModule(businessModule),
      dataPrivacyCategory: header.dataPrivacyCategory,
    } satisfies FlatAttribute;
  });
}
