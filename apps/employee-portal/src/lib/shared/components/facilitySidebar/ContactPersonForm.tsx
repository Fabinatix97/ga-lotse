/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider, Grid, Stack } from "@mui/joy";
import { ReactNode } from "react";

import {
  EmailField,
  InputField,
  PhoneNumberField,
  SALUTATION_OPTIONS,
  SelectField,
  TITLE_OPTIONS,
  createFieldNameMapper,
  useValidateLength,
} from "@eshg/lib-portal";

import { MainContactSwitchField } from "@/lib/shared/components/facilitySidebar/MainContactSwitchField";
import { BaseFacilityContactPerson } from "@/lib/shared/components/facilitySidebar/types";

interface ContactPersonFormProps {
  name: string;
  extraFieldsTop?: ReactNode;
  extraFieldsBottom?: ReactNode;
  allowMainContactPerson?: boolean;
  autoFocus?: boolean;
}

export function ContactPersonForm({
  name,
  extraFieldsTop,
  extraFieldsBottom,
  allowMainContactPerson,
  autoFocus,
}: ContactPersonFormProps) {
  const validateLength = useValidateLength();
  const fieldName = createFieldNameMapper<BaseFacilityContactPerson>(name);

  return (
    <Stack gap={2} rowGap={2}>
      {allowMainContactPerson && (
        <Grid container columnSpacing={2}>
          <Grid xs={12}>
            <MainContactSwitchField
              name={fieldName("mainContact")}
              label="Haupt-Kontaktperson"
            />
          </Grid>
        </Grid>
      )}
      <Grid container columnSpacing={2}>
        <Grid xs={6}>
          <SelectField
            autoFocus={autoFocus}
            name={fieldName("salutation")}
            label="Anrede"
            required="Bitte eine Anrede auswählen."
            options={SALUTATION_OPTIONS}
          />
        </Grid>
        <Grid xs={6}>
          <SelectField
            name={fieldName("title")}
            label="Titel"
            options={TITLE_OPTIONS}
          />
        </Grid>
      </Grid>
      {extraFieldsTop}
      <InputField
        name={fieldName("role")}
        label="Rolle"
        validate={validateLength(1, 255)}
      />
      <InputField
        name={fieldName("firstName")}
        label="Vorname"
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
