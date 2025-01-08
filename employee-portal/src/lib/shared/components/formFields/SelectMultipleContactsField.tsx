/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiContactCategory } from "@eshg/employee-portal-api/base";
import { SelectObjectField } from "@eshg/lib-portal/components/formFields/SelectObjectField";
import { useState } from "react";

import { useSearchContacts } from "@/lib/baseModule/api/queries/contacts";
import { contactCategoryNamesShort } from "@/lib/baseModule/shared/translations";
import { mapContactToSelectOptionWithCategory } from "@/lib/shared/helpers/contactCategoryMapper";

interface SelectContactFieldProps {
  name: string;
  label: string;
  categories: Set<ApiContactCategory>;
}

export function SelectMultipleContactsField(props: SelectContactFieldProps) {
  const [contactName, setContactName] = useState("");
  const searchContacts = useSearchContacts(contactName, props.categories);
  const institution = searchContacts.isSuccess
    ? searchContacts.data.elements
    : [];

  const categories = Array.from(props.categories)
    .map((c) => contactCategoryNamesShort[c])
    .join("/");

  return (
    <SelectObjectField
      name={props.name}
      label={props.label}
      getOptionLabel={(institution) =>
        mapContactToSelectOptionWithCategory(institution).label
      }
      required={`Bitte ein/e ${categories} angeben.`}
      options={institution}
      placeholder={`${categories} suchen`}
      loading={searchContacts.isLoading}
      onInputChange={(_, newInputValue) => setContactName(newInputValue)}
      disableFiltering
    />
  );
}
