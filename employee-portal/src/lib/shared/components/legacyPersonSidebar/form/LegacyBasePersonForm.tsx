/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, Stack } from "@mui/joy";

import { ApiCountryCode, ApiGender, ApiSalutation } from "@eshg/base-api";
import { CountryField } from "@eshg/lib-employee-portal";
import {
  DateField,
  GENDER_OPTIONS,
  InputField,
  OptionalFieldValue,
  SALUTATION_OPTIONS,
  SelectField,
  TITLE_OPTIONS,
  TITLE_VALUES,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";

export interface LegacyMinimalPerson {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export const MINIMAL_PERSON_VALUES = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
} as const;

export interface LegacyBasePerson extends LegacyMinimalPerson {
  salutation?: ApiSalutation;
  title?: string;
  gender?: ApiGender;
  nameAtBirth?: string;
  placeOfBirth?: string;
  countryOfBirth: OptionalFieldValue<ApiCountryCode>;
}

export const BASE_PERSON_VALUES = {
  salutation: ApiSalutation.NotSpecified,
  title: TITLE_VALUES.NOT_SPECIFIED,
  ...MINIMAL_PERSON_VALUES,
  gender: ApiGender.NotSpecified,
  countryOfBirth: "",
} as LegacyBasePerson;

interface LegacyBasePersonFormProps {
  hiddenFields?: (keyof LegacyPerson)[];
  optionalFields?: (keyof Exclude<LegacyBasePerson, LegacyMinimalPerson>)[];
  disabledFields?: (keyof LegacyPerson)[];
}

export function LegacyBasePersonForm({
  hiddenFields,
  optionalFields,
  disabledFields,
}: LegacyBasePersonFormProps) {
  const validateLength = useValidateLength();
  return (
    <Stack gap={2} rowGap={2}>
      {(!hiddenFields?.includes("salutation") ||
        !hiddenFields?.includes("title")) && (
        <Grid container columnSpacing={2}>
          {!hiddenFields?.includes("salutation") && (
            <Grid xs={6}>
              <SelectField
                name="salutation"
                label="Anrede"
                required={
                  !optionalFields?.includes("salutation")
                    ? "Bitte eine Anrede auswählen."
                    : undefined
                }
                options={SALUTATION_OPTIONS}
              />
            </Grid>
          )}
          {!hiddenFields?.includes("title") && (
            <Grid xs={6}>
              <SelectField
                name="title"
                label="Titel"
                required={
                  !optionalFields?.includes("title")
                    ? "Bitte einen Titel auswählen."
                    : undefined
                }
                options={TITLE_OPTIONS}
              />
            </Grid>
          )}
        </Grid>
      )}
      <InputField
        name="firstName"
        label="Vorname"
        required="Bitte einen Vornamen angeben."
        validate={validateLength(1, 80)}
        disabled={disabledFields?.includes("firstName")}
      />
      <InputField
        name="lastName"
        label="Nachname"
        required="Bitte einen Nachnamen angeben."
        validate={validateLength(1, 120)}
        disabled={disabledFields?.includes("lastName")}
      />
      <Grid container columnSpacing={2}>
        <Grid xs={!hiddenFields?.includes("gender") ? 6 : 12}>
          <DateField
            name="dateOfBirth"
            label="Geburtsdatum"
            required="Bitte ein Geburtsdatum angeben."
            disabled={disabledFields?.includes("dateOfBirth")}
            validate={validateDateOfBirth}
          />
        </Grid>
        {!hiddenFields?.includes("gender") && (
          <Grid xs={6}>
            <SelectField
              name="gender"
              label="Geschlecht"
              options={GENDER_OPTIONS}
              required={
                !optionalFields?.includes("gender")
                  ? "Bitte das Geschlecht auswählen."
                  : undefined
              }
            />
          </Grid>
        )}
      </Grid>
      {!hiddenFields?.includes("nameAtBirth") && (
        <InputField
          name="nameAtBirth"
          label="Geburtsname"
          required={
            !optionalFields?.includes("nameAtBirth")
              ? "Bitte den Geburtsnamen angeben."
              : undefined
          }
        />
      )}
      {!hiddenFields?.includes("placeOfBirth") && (
        <InputField
          name="placeOfBirth"
          label="Geburtsort"
          required={
            !optionalFields?.includes("placeOfBirth")
              ? "Bitte einen Geburtsort angeben."
              : undefined
          }
        />
      )}
      {!hiddenFields?.includes("countryOfBirth") && (
        <CountryField
          name="countryOfBirth"
          label="Geburtsland"
          required={
            !optionalFields?.includes("countryOfBirth")
              ? "Bitte ein Geburtsland auswählen."
              : undefined
          }
        />
      )}
    </Stack>
  );
}
