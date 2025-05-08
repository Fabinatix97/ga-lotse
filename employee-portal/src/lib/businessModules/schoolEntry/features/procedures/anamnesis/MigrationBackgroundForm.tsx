/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormLabel, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import {
  NestedFormProps,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { ApiSchoolEntryCountryCode } from "@eshg/school-entry-api";

import { CountryCodes } from "@/lib/businessModules/schoolEntry/api/models/CountryCodes";
import { MigrationBackgroundValues } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/AnamnesisForm";
import { CountryWithNumberField } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/CountryWithNumberField";

type NationalityValues = keyof Omit<
  MigrationBackgroundValues,
  "hasMigrationBackground" | "inGermanySince"
>;

const MIGRATION_FIELDS: { name: NationalityValues; label: string }[][] = [
  [
    { name: "nationalityChild", label: "StA bei Geb. Kind" },
    { name: "countryOfBirthChild", label: "Geburtsland Kind" },
  ],
  [
    { name: "nationalityFirstParent", label: "StA bei Geb. Elternteil 1" },
    {
      name: "countryOfBirthFirstParent",
      label: "Geburtsland des Elternteil 1",
    },
  ],
  [
    { name: "nationalitySecondParent", label: "StA bei Geb. Elternteil 2" },
    {
      name: "countryOfBirthSecondParent",
      label: "Geburtsland des Elternteil 2",
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
    void props.setFieldValue(
      fieldName("inGermanySince.month"),
      props.dateOfBirth.getMonth(),
    );
    void props.setFieldValue(
      fieldName("inGermanySince.year"),
      props.dateOfBirth.getFullYear(),
    );

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
    <Stack gap={2}>
      <Typography level="title-sm">Migrationshintergrund</Typography>
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
      <Stack direction="row" gap={2}>
        <FormLabel sx={{ fontSize: "14px", fontWeight: "500" }}>
          in Deutschland seit
        </FormLabel>
        <MonthAndYearFields
          testId="inGermanySince"
          fieldName={fieldName("inGermanySince")}
          date={props.values.inGermanySince}
        />
      </Stack>
    </Stack>
  );
}
