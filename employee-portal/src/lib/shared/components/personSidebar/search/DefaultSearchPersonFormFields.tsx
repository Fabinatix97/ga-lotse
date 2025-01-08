/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";

import { SearchPersonFormValues } from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";

export function DefaultSearchPersonFormFields() {
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
      />
    </>
  );
}
