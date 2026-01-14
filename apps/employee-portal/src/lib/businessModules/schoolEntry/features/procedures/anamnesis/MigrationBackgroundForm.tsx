/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  HorizontalField,
  NestedFormProps,
  SetFieldValueHelper,
  SoftRequiredBooleanSelectField,
  createFieldNameMapper,
  isEmptyString,
} from "@eshg/lib-portal";
import { ApiSchoolEntryCountryCode } from "@eshg/school-entry-api";

import { CountryCodes } from "@/lib/businessModules/schoolEntry/api/models/CountryCodes";
import { MigrationBackgroundValues } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/AnamnesisForm";
import { CountryWithNumberField } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/CountryWithNumberField";
import { REQUIRED_PROCEDURE_PROPERTIES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

type NationalityValues = keyof Omit<
  MigrationBackgroundValues,
  "hasMigrationBackground"
>;

const MIGRATION_FIELDS: { name: NationalityValues; label: string }[][] = [
  [
    {
      name: "nationalityChild",
      label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_NATIONALITY_CHILD,
    },
    {
      name: "countryOfBirthChild",
      label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_COUNTRY_OF_BIRTH_CHILD,
    },
  ],
  [
    {
      name: "nationalityFirstParent",
      label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_NATIONALITY_FIRST_PARENT,
    },
    {
      name: "countryOfBirthFirstParent",
      label:
        REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_COUNTRY_OF_BIRTH_FIRST_PARENT,
    },
  ],
  [
    {
      name: "nationalitySecondParent",
      label: REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_NATIONALITY_SECOND_PARENT,
    },
    {
      name: "countryOfBirthSecondParent",
      label:
        REQUIRED_PROCEDURE_PROPERTIES.ANAMNESIS_COUNTRY_OF_BIRTH_SECOND_PARENT,
    },
  ],
];

interface MigrationBackgroundFormProps extends NestedFormProps {
  values: MigrationBackgroundValues;
  setFieldValue: SetFieldValueHelper;
  dateOfBirth: Date;
  countryCodes: CountryCodes;
}

const FIXED_STYLE: SxProps = {
  "--FormLabel-margin": "0 16px 0 0",
  ".MuiSelect-root": { width: "90px" },
  ".MuiFormLabel-root": { width: "170px" },
};

export function MigrationBackgroundForm(props: MigrationBackgroundFormProps) {
  const fieldName = createFieldNameMapper(props.name);

  function setHasMigrationBackground(value: boolean) {
    void props.setFieldValue(fieldName("hasMigrationBackground"), value);
  }

  function isGermanCountryCode(value: string) {
    return value === ApiSchoolEntryCountryCode.Deu;
  }

  function handleNationalityChange(name: string, value: string) {
    if (!isGermanCountryCode(value)) {
      setHasMigrationBackground(true);
    }

    if (name === "nationalityChild") {
      if (isEmptyString(props.values.countryOfBirthChild)) {
        void props.setFieldValue(fieldName("countryOfBirthChild"), value);
      }
      if (
        isGermanCountryCode(value) &&
        isGermanCountryCode(props.values.nationalityFirstParent) &&
        isGermanCountryCode(props.values.nationalitySecondParent)
      ) {
        setHasMigrationBackground(false);
      }
    } else if (name === "nationalityFirstParent") {
      if (isEmptyString(props.values.countryOfBirthFirstParent)) {
        void props.setFieldValue(fieldName("countryOfBirthFirstParent"), value);
      }
      if (
        isGermanCountryCode(value) &&
        isGermanCountryCode(props.values.nationalityChild) &&
        isGermanCountryCode(props.values.nationalitySecondParent)
      ) {
        setHasMigrationBackground(false);
      }
    } else if (name === "nationalitySecondParent") {
      if (isEmptyString(props.values.countryOfBirthSecondParent)) {
        void props.setFieldValue(
          fieldName("countryOfBirthSecondParent"),
          value,
        );
      }
      if (
        isGermanCountryCode(value) &&
        isGermanCountryCode(props.values.nationalityChild) &&
        isGermanCountryCode(props.values.nationalityFirstParent)
      ) {
        setHasMigrationBackground(false);
      }
    }
  }

  function setMigrationBackgroundFields() {
    for (const migrationfield of MIGRATION_FIELDS.flatMap(
      (elements) => elements,
    )) {
      void props.setFieldValue(
        fieldName(migrationfield.name),
        ApiSchoolEntryCountryCode.Deu,
      );
    }
  }

  function resolveCountryCode(
    fieldName: NationalityValues,
  ): number | undefined {
    return props.countryCodes[props.values[fieldName]];
  }

  return (
    <Stack gap={2} role="group" aria-labelledby="migrationshintergrund-label">
      <Typography
        level="title-sm"
        component="h2"
        id="migrationshintergrund-label"
      >
        Migrationshintergrund
      </Typography>
      <SoftRequiredBooleanSelectField
        name={fieldName("hasMigrationBackground")}
        label="Migrationshintergrund"
        component={HorizontalField}
        sx={FIXED_STYLE}
        allowDeselection
        softRequired
        onChange={(value) => {
          if (value === false) {
            setMigrationBackgroundFields();
          }
        }}
      />
      <Stack direction="row" gap={4} flexWrap="wrap" alignItems="flex-start">
        {MIGRATION_FIELDS.map((fields, columnIndex) => (
          <Stack key={columnIndex} gap={1} flexWrap="wrap">
            {fields.map((field, rowIndex) => (
              <Stack key={field.name} direction="row" gap={2} flexWrap="wrap">
                <CountryWithNumberField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  countryCode={resolveCountryCode(field.name)}
                  onChange={(value: string) => {
                    if (rowIndex === 0) {
                      handleNationalityChange(field.name, value);
                    }
                  }}
                />
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
