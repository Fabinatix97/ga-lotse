/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";

import { ApiContactCategory } from "@eshg/base-api";
import { SelectObjectField } from "@eshg/lib-portal";

import { getEntityId, isSameEntity } from "../../../api/models/BaseEntity";
import { useSearchContacts } from "../api/queries";
import { CONTACT_CATEGORY_NAMES_SHORT } from "../translations";
import { formatInstitutionNameWithCategoryShort } from "../utils/formatters";

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
      getOptionKey={getEntityId}
      required={`Bitte ein/e ${categories} angeben.`}
      options={contacts}
      isOptionEqualToValue={isSameEntity}
      placeholder={`${categories} suchen`}
      loading={searchContacts.isLoading}
      disableFiltering
      onInputChange={(_, newInputValue) => setContactName(newInputValue)}
    />
  );
}
