/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAttributeSelection } from "@eshg/employee-portal-api/statistics";

const MAPPING_DICTIONARY = new Map<string, ApiAttributeSelection>();

export function mapAttributeSelectionToKey(
  attributeSelection: ApiAttributeSelection,
): string {
  const key = `${attributeSelection.baseModuleAttributeCode ?? ""}|${attributeSelection.businessModuleName}|${attributeSelection.businessModuleAttributeCode}|${attributeSelection.dataSourceId}`;
  MAPPING_DICTIONARY.set(key, attributeSelection);
  return key;
}

export function mapKeyToAttributeSelection(key: string): ApiAttributeSelection {
  if (!MAPPING_DICTIONARY.has(key)) {
    throw new Error(
      `MAPPING_DICTIONARY should contain ApiAttributeSelection for key: ${key}`,
    );
  }
  return MAPPING_DICTIONARY.get(key)!;
}

export function isValidAttributeKey(key: string): boolean {
  return MAPPING_DICTIONARY.has(key);
}
