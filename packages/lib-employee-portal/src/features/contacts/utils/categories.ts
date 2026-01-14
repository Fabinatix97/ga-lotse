/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiContactCategory, ApiContactSubCategory } from "@eshg/base-api";
import { formatOptionalKey } from "@eshg/lib-portal";

import { CONTACT_SUB_CATEGORY_NAMES_SCHOOL } from "../translations";

export function hasSubCategories(category?: ApiContactCategory): boolean {
  return getSubCategories(category) !== undefined;
}

export function formatSubCategory(
  category?: ApiContactCategory,
  subCategory?: ApiContactSubCategory,
) {
  const subCategories = getSubCategories(category);
  if (subCategories === undefined) {
    return "";
  }
  return formatOptionalKey(subCategory, subCategories, "");
}

export function getSubCategories(
  category?: ApiContactCategory,
): Record<ApiContactSubCategory, string> | undefined {
  if (category === ApiContactCategory.School) {
    return CONTACT_SUB_CATEGORY_NAMES_SCHOOL;
  }
  return undefined;
}
