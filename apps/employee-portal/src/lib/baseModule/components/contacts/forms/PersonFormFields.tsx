/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid } from "@mui/joy";

import {
  GENDER_OPTIONS,
  InputField,
  SALUTATION_OPTIONS,
  SelectField,
  TITLE_OPTIONS,
  createFieldNameMapper,
  useValidateLength,
} from "@eshg/lib-portal";

import { PersonContactFormValues } from "@/lib/baseModule/components/contacts/types";

const fieldName = createFieldNameMapper<PersonContactFormValues>();

export function PersonFormFields() {
  const validateLength = useValidateLength();
  return (
    <>
      <Grid xxs={6}>
        <SelectField
          name={fieldName("salutation")}
          label="Anrede"
          options={SALUTATION_OPTIONS}
        />
      </Grid>
      <Grid xxs={6}>
        <SelectField
          name={fieldName("title")}
          label="Titel"
          options={TITLE_OPTIONS}
        />
      </Grid>
      <Grid xxs={12}>
        <InputField
          name={fieldName("firstName")}
          label="Vorname"
          required="Bitte einen Vornamen angeben"
          validate={validateLength(1, 80)}
        />
      </Grid>
      <Grid xxs={12}>
        <InputField
          name={fieldName("name")}
          label="Name"
          required="Bitte einen Namen angeben"
          validate={validateLength(1, 120)}
        />
      </Grid>
      <Grid xxs={12}>
        <SelectField
          name={fieldName("gender")}
          label="Geschlecht"
          options={GENDER_OPTIONS}
        />
      </Grid>
      <Grid xxs={12}>
        <InputField
          name={fieldName("externalChatUsername")}
          label="Chat-ID"
          validate={validateLength(1, 255)}
        />
      </Grid>
      <Grid xxs={12}>
        <Divider />
      </Grid>
    </>
  );
}
