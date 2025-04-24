/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { PhoneNumberField } from "@eshg/lib-portal/components/formFields/PhoneNumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  SALUTATION_OPTIONS,
  TITLE_OPTIONS,
} from "@eshg/lib-portal/components/formFields/constants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { Divider, Grid, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { MainContactSwitchField } from "@/lib/shared/components/facilitySidebar/MainContactSwitchField";
import { BaseFacilityContactPerson } from "@/lib/shared/components/facilitySidebar/types";

interface ContactPersonFormProps {
  name: string;
  extraFieldsTop?: ReactNode;
  extraFieldsBottom?: ReactNode;
  allowMainContactPerson?: boolean;
}

export function ContactPersonForm({
  name,
  extraFieldsTop,
  extraFieldsBottom,
  allowMainContactPerson,
}: ContactPersonFormProps) {
  const { validateLength } = useValidators();
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
