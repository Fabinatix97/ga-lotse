/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateDateOfBirth } from "@eshg/lib-portal/helpers/validators";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";

import { SearchPersonFormValues } from "./SearchPersonSidebar";

export function DefaultSearchPersonFormFields() {
  const { validateLength } = useValidators();
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
