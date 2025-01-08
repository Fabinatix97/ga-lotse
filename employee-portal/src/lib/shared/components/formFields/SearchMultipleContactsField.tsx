/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiContactCategory } from "@eshg/employee-portal-api/base";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { SearchOutlined } from "@mui/icons-material";
import { useState } from "react";

import { useSearchContacts } from "@/lib/baseModule/api/queries/contacts";
import { contactCategoryNamesShort } from "@/lib/baseModule/shared/translations";
import { mapContactToSelectOptionWithCategory } from "@/lib/shared/helpers/contactCategoryMapper";

interface SearchContactFieldProps {
  name: string;
  label: string;
  categories: Set<ApiContactCategory>;
}

export function SearchMultipleContactsField(props: SearchContactFieldProps) {
  const [contactName, setContactName] = useState("");
  const searchContacts = useSearchContacts(contactName, props.categories);
  const schools = searchContacts.isSuccess ? searchContacts.data.elements : [];
  const options = schools.map(mapContactToSelectOptionWithCategory);

  const categories = Array.from(props.categories)
    .map((c) => contactCategoryNamesShort[c])
    .join("/");

  return (
    <SingleAutocompleteField
      name={props.name}
      label={props.label}
      required={`Bitte ein/e ${categories} angeben.`}
      options={options}
      placeholder={`${categories} suchen`}
      endDecorator={<SearchOutlined />}
      loading={searchContacts.isLoading}
      onInputChange={(_, newInputValue) => setContactName(newInputValue)}
      disableFiltering
    />
  );
}
