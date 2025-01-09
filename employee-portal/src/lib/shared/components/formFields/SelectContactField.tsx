/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiAddContact200Response,
  ApiContactCategory,
} from "@eshg/employee-portal-api/base";
import {
  SelectObjectField,
  SelectObjectFieldValue,
} from "@eshg/lib-portal/components/formFields/SelectObjectField";
import { ReactNode, useState } from "react";

import { useSearchContacts } from "@/lib/baseModule/api/queries/contacts";

interface SelectContactFieldProps {
  name: string;
  label: string;
  categories: Set<ApiContactCategory>;
  onChange?: (
    value: SelectObjectFieldValue<ApiAddContact200Response, false>,
  ) => void;
  getOptionLabel?: (contact: ApiAddContact200Response) => string;
  required?: string;
  placeholder?: string;
  endDecorator?: ReactNode;
}

export function SelectContactField(props: SelectContactFieldProps) {
  const [searchString, setSearchString] = useState("");
  const query = useSearchContacts(searchString, props.categories);
  const contacts = query.isSuccess ? query.data.elements : [];
  return (
    <SelectObjectField
      name={props.name}
      label={props.label}
      getOptionLabel={props.getOptionLabel ?? ((contact) => contact.name)}
      options={contacts}
      onInputChange={(_, newInputValue) => setSearchString(newInputValue)}
      loading={query.isLoading}
      onValueChanged={props.onChange}
      disableFiltering
      required={props.required}
      placeholder={props.placeholder}
      endDecorator={props.endDecorator}
    />
  );
}
