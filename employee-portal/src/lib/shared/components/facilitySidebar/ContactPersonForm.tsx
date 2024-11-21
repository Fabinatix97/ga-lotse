/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Divider, Grid, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { BaseFacilityContactPerson } from "@/lib/shared/components/facilitySidebar/types";
import { EmailField } from "@/lib/shared/components/formFields/EmailField";
import { PhoneNumberField } from "@/lib/shared/components/formFields/PhoneNumberField";
import {
  SALUTATION_OPTIONS,
  TITLE_OPTIONS,
} from "@/lib/shared/components/personSidebar/constants";

interface ContactPersonFormProps {
  name: string;
  extraFieldsTop?: ReactNode;
  extraFieldsBottom?: ReactNode;
  salutationRequired?: boolean;
  titleRequired?: boolean;
  roleRequired?: boolean;
}

export function ContactPersonForm({
  name,
  extraFieldsTop,
  extraFieldsBottom,
  salutationRequired = true,
  titleRequired = true,
  roleRequired = true,
}: ContactPersonFormProps) {
  const fieldName = createFieldNameMapper<BaseFacilityContactPerson>(name);

  return (
    <Stack gap={2} rowGap={2}>
      <Grid container columnSpacing={2}>
        <Grid xs={6}>
          <SelectField
            name={fieldName("salutation")}
            label="Anrede"
            required={
              salutationRequired ? "Bitte eine Anrede auswählen." : undefined
            }
            options={SALUTATION_OPTIONS}
          />
        </Grid>
        <Grid xs={6}>
          <SelectField
            name={fieldName("title")}
            label="Titel"
            required={titleRequired ? "Bitte einen Titel angeben." : undefined}
            options={TITLE_OPTIONS}
          />
        </Grid>
      </Grid>
      {extraFieldsTop}
      <InputField
        name={fieldName("role")}
        label="Rolle"
        required={roleRequired ? "Bitte eine Rolle angeben." : undefined}
        validate={validateLength(1, 255)}
      />
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
        validate={validateLength(1, 80)}
      />
      <EmailField
        name={fieldName("emailAddress")}
        label="E-Mail-Adresse"
        validate={validateLength(6, 254)}
      />
      <PhoneNumberField
        name={fieldName("phoneNumber")}
        label="Telefonnummer"
        validate={validateLength(1, 23)}
      />

      {extraFieldsBottom && (
        <>
          <Divider />
          {extraFieldsBottom}
        </>
      )}
    </Stack>
  );
}
