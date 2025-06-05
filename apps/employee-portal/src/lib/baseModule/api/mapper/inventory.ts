/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddInventoryItemRequest,
  ApiInventoryItem,
  ApiUpdateInventoryItemRequest,
} from "@eshg/base-api";
import { mapOptionalValue, mapRequiredValue } from "@eshg/lib-portal";

import { InventoryFormValues } from "@/lib/baseModule/components/inventory/forms/InventoryForm";

export function mapAddInventoryItemRequest(
  values: InventoryFormValues,
): ApiAddInventoryItemRequest {
  return {
    type: mapRequiredValue(values.type),
    name: values.name,
    minCount: mapRequiredValue(values.minCount),
    count: 0,
    description: values.description,
    articleNumber: values.articleNumber,
    labelNames: values.labelNames,
  };
}

export function mapUpdateInventoryItemRequest(
  values: InventoryFormValues,
): ApiUpdateInventoryItemRequest {
  return {
    type: mapRequiredValue(values.type),
    name: values.name,
    description: mapOptionalValue(values.description),
    articleNumber: mapOptionalValue(values.articleNumber),
    labelNames: values.labelNames,
    minCount: mapRequiredValue(values.minCount),
  };
}

export function mapInventoryItemToUpdateInventoryValues(
  item: ApiInventoryItem,
): InventoryFormValues {
  return {
    type: item.type,
    name: item.name,
    minCount: item.minCount,
    labelNames: item.labels.map((label) => label.name),
    articleNumber: item.articleNumber ?? "",
    description: item.description ?? "",
  };
}
