/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiAddContact200Response,
  ApiInstitutionContact,
} from "@eshg/employee-portal-api/base";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { isDefined } from "remeda";

import { contactCategoryNamesShort } from "@/lib/baseModule/shared/translations";

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
  const category = (contact as ApiInstitutionContact).category;

  if (!isDefined(category)) {
    return mapContactToSelectOption(contact);
  } else {
    const categoryName: string = contactCategoryNamesShort[category];

    return {
      label: `${contact.name} (${categoryName})`,
      value: contact.id,
    };
  }
}
