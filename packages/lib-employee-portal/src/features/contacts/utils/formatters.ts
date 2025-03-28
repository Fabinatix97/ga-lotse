/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiAddContact200Response } from "@eshg/base-api";

import { CONTACT_CATEGORY_NAMES_SHORT } from "@/features/contacts/translations";

export function formatInstitutionNameWithCategoryShort(
  contact: ApiAddContact200Response,
): string {
  if (contact.type === "PersonContact") {
    throw new Error(
      "PersonContact cannot be mapped to institution select option",
    );
  }

  if (contact.category === undefined) {
    return contact.name;
  }

  const categoryName = CONTACT_CATEGORY_NAMES_SHORT[contact.category];
  return `${contact.name} (${categoryName})`;
}
