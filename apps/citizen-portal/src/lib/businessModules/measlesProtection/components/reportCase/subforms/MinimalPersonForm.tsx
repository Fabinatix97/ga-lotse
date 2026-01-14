/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";

import {
  DateField,
  InputField,
  createFieldNameMapper,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
} from "@/lib/businessModules/measlesProtection/shared/constants";
import { useTranslation } from "@/lib/i18n/client";

export interface NestedFormProps {
  name: string;
}

export interface MinimalPerson {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export const minimalPersonInitial: MinimalPerson = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
};

export function MinimalPersonForm(props: Readonly<NestedFormProps>) {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const validateLength = useValidateLength();
  const fieldName = createFieldNameMapper(props.name);
  return (
    <Stack gap={2} rowGap={2}>
      <InputField
        name={fieldName("firstName")}
        label={t("minimal_person_config.firstName.label")}
        required={t("minimal_person_config.firstName.required")}
        validate={validateLength(1, FIRST_NAME_MAX_LENGTH)}
      />
      <InputField
        name={fieldName("lastName")}
        label={t("minimal_person_config.lastName.label")}
        required={t("minimal_person_config.lastName.required")}
        validate={validateLength(1, LAST_NAME_MAX_LENGTH)}
      />
      <Grid container columnSpacing={2}>
        <Grid xxs={12}>
          <DateField
            name={fieldName("dateOfBirth")}
            label={t("minimal_person_config.dateOfBirth.label")}
            required={t("minimal_person_config.dateOfBirth.required")}
            validate={validateDateOfBirth}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
