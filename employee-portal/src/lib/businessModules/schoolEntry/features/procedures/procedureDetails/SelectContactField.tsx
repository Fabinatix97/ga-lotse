/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddContact200Response,
  ApiContactCategory,
} from "@eshg/employee-portal-api/base";
import {
  SelectObjectField,
  SelectObjectFieldValue,
} from "@eshg/lib-portal/components/formFields/SelectObjectField";
import { useState } from "react";

import { useSearchContacts } from "@/lib/baseModule/api/queries/contacts";

interface SelectContactFieldProps {
  name: string;
  label: string;
  category: ApiContactCategory;
  onChange?: (
    value: SelectObjectFieldValue<ApiAddContact200Response, false>,
  ) => void;
}

export function SelectContactField(props: SelectContactFieldProps) {
  const [searchString, setSearchString] = useState("");
  const query = useSearchContacts(searchString, props.category);
  const contacts = query.isSuccess ? query.data.elements : [];
  return (
    <SelectObjectField
      name={props.name}
      label={props.label}
      getOptionLabel={(contact) => contact.name}
      options={contacts}
      onInputChange={(_, newInputValue) => setSearchString(newInputValue)}
      loading={query.isLoading}
      onValueChanged={props.onChange}
      disableFiltering
    />
  );
}
