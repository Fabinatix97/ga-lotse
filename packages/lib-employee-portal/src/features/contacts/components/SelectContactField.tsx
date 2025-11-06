/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useState } from "react";

import { ApiAddContact200Response, ApiContactCategory } from "@eshg/base-api";
import {
  SelectObjectField,
  SelectObjectFieldValue,
  Validator,
} from "@eshg/lib-portal";

import { getEntityId, isSameEntity } from "../../../api/models/BaseEntity";
import { useSearchContacts } from "../api/queries";

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
  disabled?: boolean;
  validate?: Validator<SelectObjectFieldValue<object, false>>;
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
      getOptionKey={getEntityId}
      options={contacts}
      isOptionEqualToValue={isSameEntity}
      loading={query.isLoading}
      disableFiltering
      validate={props.validate}
      required={props.required}
      placeholder={props.placeholder}
      endDecorator={props.endDecorator}
      disabled={props.disabled}
      onInputChange={(_, newInputValue) => setSearchString(newInputValue)}
      onValueChanged={props.onChange}
    />
  );
}
