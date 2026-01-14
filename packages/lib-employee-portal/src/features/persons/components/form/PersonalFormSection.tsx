/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, Stack } from "@mui/joy";

import {
  DateField,
  GENDER_OPTIONS,
  InputField,
  PERSON_FIELD_NAME,
  SALUTATION_OPTIONS,
  SelectField,
  TITLE_OPTIONS,
  createFieldNameMapper,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import { CountryField } from "../../../../components/formFields/CountryField";
import { PersonFormProps } from "../../types/personForm";

import { DefaultPersonFormValues } from "./DefaultPersonForm";

export function PersonalFormSection<TValues>(props: PersonFormProps<TValues>) {
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
        readOnly={props.mode !== "edit"}
        required={
          props.mode === "edit" ? "Bitte einen Vornamen angeben" : undefined
        }
        validate={validateLength(1, 80)}
      />
      <InputField
        name={fieldName("lastName")}
        label={PERSON_FIELD_NAME.lastName}
        readOnly={props.mode !== "edit"}
        required={
          props.mode === "edit" ? "Bitte einen Namen angeben" : undefined
        }
        validate={validateLength(1, 120)}
      />

      <Grid container spacing={2}>
        <Grid xxs>
          <DateField
            name={fieldName("dateOfBirth")}
            label={PERSON_FIELD_NAME.dateOfBirth}
            readOnly={props.mode !== "edit"}
            required={
              props.mode === "edit"
                ? "Bitte ein Geburtsdatum angeben"
                : undefined
            }
            validate={validateDateOfBirth}
          />
        </Grid>
        <Grid xxs>
          <SelectField
            name={fieldName("gender")}
            label={PERSON_FIELD_NAME.gender}
            options={GENDER_OPTIONS}
          />
        </Grid>
      </Grid>

      <InputField
        name={fieldName("nameAtBirth")}
        label={PERSON_FIELD_NAME.nameAtBirth}
        validate={validateLength(1, 40)}
      />

      <InputField
        name={fieldName("placeOfBirth")}
        label={PERSON_FIELD_NAME.placeOfBirth}
        validate={validateLength(1, 50)}
      />

      <CountryField
        name={fieldName("countryOfBirth")}
        label={PERSON_FIELD_NAME.countryOfBirth}
      />
    </Stack>
  );
}
