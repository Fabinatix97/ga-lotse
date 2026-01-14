/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack } from "@mui/joy";

import { DefaultPersonFormValues } from "@eshg/lib-employee-portal";
import {
  GENDER_OPTIONS,
  InputField,
  PERSON_FIELD_NAME,
  SALUTATION_OPTIONS,
  SelectField,
  TITLE_OPTIONS,
  createFieldNameMapper,
  useValidateLength,
} from "@eshg/lib-portal";

export function PersonalFormSectionWithoutDateOfBirthDetails() {
  const validateLength = useValidateLength();
  const fieldName = createFieldNameMapper<DefaultPersonFormValues>();
  return (
    <Stack gap={3} role="group" aria-label="Personendaten">
      <Grid container spacing={2}>
        <Grid xxs>
          <SelectField
            name={fieldName("salutation")}
            label={PERSON_FIELD_NAME.salutation}
            options={SALUTATION_OPTIONS}
          />
        </Grid>
        <Grid xxs>
          <SelectField
            name={fieldName("title")}
            label={PERSON_FIELD_NAME.title}
            options={TITLE_OPTIONS}
          />
        </Grid>
      </Grid>

      <InputField
        name={fieldName("firstName")}
        label={PERSON_FIELD_NAME.firstName}
        required="Bitte einen Vornamen angeben"
        validate={validateLength(1, 80)}
      />
      <InputField
        name={fieldName("lastName")}
        label={PERSON_FIELD_NAME.lastName}
        required="Bitte einen Namen angeben"
        validate={validateLength(1, 120)}
      />

      <SelectField
        name={fieldName("gender")}
        label={PERSON_FIELD_NAME.gender}
        options={GENDER_OPTIONS}
      />
    </Stack>
  );
}
