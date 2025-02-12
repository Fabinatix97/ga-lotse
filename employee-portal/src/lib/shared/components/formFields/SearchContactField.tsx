/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiContactCategory } from "@eshg/base-api";

import { contactCategoryNames } from "@/lib/baseModule/shared/translations";
import { SelectContactField } from "@/lib/shared/components/formFields/SelectContactField";

interface SearchContactFieldProps {
  name: string;
  label: string;
  category: ApiContactCategory;
}

const requiredMessage: Record<ApiContactCategory, string> = {
  [ApiContactCategory.Laboratory]: "Bitte ein Labor angeben.",
  [ApiContactCategory.School]: "Bitte eine Schule angeben.",
  [ApiContactCategory.Daycare]: "Bitte eine Kita angeben.",
  [ApiContactCategory.DoctorsOffice]: "Bitte eine Arztpraxis angeben.",
  [ApiContactCategory.HealthDepartment]: "Bitte ein Gesundheitsamt angeben.",
  [ApiContactCategory.Misc]: "Bitte eine Einrichtung angeben.",
};

export function SearchContactField(props: SearchContactFieldProps) {
  const translatedCategory = contactCategoryNames[props.category];

  return (
    <SelectContactField
      name={props.name}
      label={props.label}
      categories={new Set([props.category])}
      placeholder={`${translatedCategory} suchen`}
      required={requiredMessage[props.category]}
    />
  );
}
