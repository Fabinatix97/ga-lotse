/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiContactCategory } from "@eshg/employee-portal-api/base";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { SearchOutlined } from "@mui/icons-material";
import { useState } from "react";

import { useSearchContacts } from "@/lib/baseModule/api/queries/contacts";
import { contactCategoryNames } from "@/lib/baseModule/shared/translations";
import { mapContactToSelectOption } from "@/lib/shared/helpers/contactCategoryMapper";

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
  const [contactName, setContactName] = useState("");
  const categories = new Set<ApiContactCategory>();
  categories.add(props.category);
  const searchContacts = useSearchContacts(contactName, categories);
  const schools = searchContacts.isSuccess ? searchContacts.data.elements : [];
  const options = schools.map(mapContactToSelectOption);

  const translatedCategory = contactCategoryNames[props.category];

  return (
    <SingleAutocompleteField
      name={props.name}
      label={props.label}
      required={requiredMessage[props.category]}
      options={options}
      placeholder={`${translatedCategory} suchen`}
      endDecorator={<SearchOutlined />}
      loading={searchContacts.isLoading}
      onInputChange={(_, newInputValue) => setContactName(newInputValue)}
      disableFiltering
    />
  );
}
