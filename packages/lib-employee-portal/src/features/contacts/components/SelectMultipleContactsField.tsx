/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiContactCategory } from "@eshg/base-api";
import { SelectObjectField } from "@eshg/lib-portal/components/formFields/SelectObjectField";
import { useState } from "react";

import { useSearchContacts } from "@/features/contacts/api/queries";
import { CONTACT_CATEGORY_NAMES_SHORT } from "@/features/contacts/translations";
import { formatInstitutionNameWithCategoryShort } from "@/features/contacts/utils/formatters";

interface SelectContactFieldProps {
  name: string;
  label: string;
  categories: Set<ApiContactCategory>;
}

export function SelectMultipleContactsField(props: SelectContactFieldProps) {
  const [contactName, setContactName] = useState("");
  const searchContacts = useSearchContacts(contactName, props.categories);
  const contacts = searchContacts.isSuccess ? searchContacts.data.elements : [];

  const categories = Array.from(props.categories)
    .map((c) => CONTACT_CATEGORY_NAMES_SHORT[c])
    .join("/");

  return (
    <SelectObjectField
      name={props.name}
      label={props.label}
      getOptionLabel={formatInstitutionNameWithCategoryShort}
      required={`Bitte ein/e ${categories} angeben.`}
      options={contacts}
      placeholder={`${categories} suchen`}
      loading={searchContacts.isLoading}
      onInputChange={(_, newInputValue) => setContactName(newInputValue)}
      disableFiltering
    />
  );
}
