/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DateField,
  InputField,
  createFieldNameMapper,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import { SearchPersonFormValues } from "./SearchPersonSidebar";

export function DefaultSearchPersonFormFields() {
  const validateLength = useValidateLength();
  const fieldName = createFieldNameMapper<SearchPersonFormValues>();

  return (
    <>
      <InputField
        name={fieldName("firstName")}
        label="Vorname"
        required="Bitte einen Vornamen angeben."
        validate={validateLength(1, 80)}
      />
      <InputField
        name={fieldName("lastName")}
        label="Nachname"
        required="Bitte einen Nachnamen angeben."
        validate={validateLength(1, 120)}
      />
      <DateField
        name={fieldName("dateOfBirth")}
        label="Geburtsdatum"
        required="Bitte ein Geburtsdatum angeben."
        validate={validateDateOfBirth}
      />
    </>
  );
}
