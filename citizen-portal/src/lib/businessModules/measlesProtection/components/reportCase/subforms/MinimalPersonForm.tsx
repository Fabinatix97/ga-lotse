/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateDateOfBirth } from "@eshg/lib-portal/helpers/validators";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { Grid, Stack } from "@mui/joy";

import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
} from "@/lib/businessModules/measlesProtection/shared/constants";

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

const minimalPersonFormConfig = {
  firstName: {
    label: "Vorname",
    required: "Bitte einen Vorname angeben",
  },
  lastName: {
    label: "Nachname",
    required: "Bitte einen Nachname angeben",
  },
  dateOfBirth: {
    label: "Geburtsdatum",
    required: "Bitte ein Geburtsdatum angeben",
  },
};

export function MinimalPersonForm(props: Readonly<NestedFormProps>) {
  const { validateLength } = useValidators();
  const fieldName = createFieldNameMapper(props.name);
  return (
    <Stack gap={2} rowGap={2}>
      <InputField
        name={fieldName("firstName")}
        label={minimalPersonFormConfig.firstName.label}
        required={minimalPersonFormConfig.firstName.required}
        validate={validateLength(1, FIRST_NAME_MAX_LENGTH)}
      />
      <InputField
        name={fieldName("lastName")}
        label={minimalPersonFormConfig.lastName.label}
        required={minimalPersonFormConfig.lastName.required}
        validate={validateLength(1, LAST_NAME_MAX_LENGTH)}
      />
      <Grid container columnSpacing={2}>
        <Grid xxs={12}>
          <DateField
            name={fieldName("dateOfBirth")}
            label={minimalPersonFormConfig.dateOfBirth.label}
            required={minimalPersonFormConfig.dateOfBirth.required}
            validate={validateDateOfBirth}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
