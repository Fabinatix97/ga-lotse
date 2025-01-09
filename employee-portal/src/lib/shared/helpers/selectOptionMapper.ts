/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiAddContact200Response,
  ApiInstitutionContact,
} from "@eshg/employee-portal-api/base";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";

import { contactCategoryNamesShort } from "@/lib/baseModule/shared/translations";

export function mapToSelectOption(option: string): SelectOption {
  return {
    label: option,
    value: option,
  };
}

export function mapContactToSelectOption(
  contact: ApiAddContact200Response,
): SelectOption {
  return {
    label: contact.name,
    value: contact.id,
  };
}

export function mapContactToSelectOptionWithCategory(
  contact: ApiAddContact200Response,
): SelectOption {
  return {
    label: getInstitutionOptionLabel(contact),
    value: contact.id,
  };
}

export function getInstitutionOptionLabel(
  institution: ApiAddContact200Response,
): string {
  const category = (institution as ApiInstitutionContact).category;
  if (category !== undefined) {
    const categoryName: string = contactCategoryNamesShort[category];
    return `${institution.name} (${categoryName})`;
  }
  return institution.name;
}
