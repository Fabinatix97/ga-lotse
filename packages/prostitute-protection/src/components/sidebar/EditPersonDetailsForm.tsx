/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { ChangeEvent } from "react";

import {
  CheckboxField,
  DateField,
  GENDER_OPTIONS,
  InputField,
  SelectField,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";
import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

import { LANGUAGE_OPTIONS } from "../../shared/constants";

import { EditPersonalDataForm } from "./EditPersonDetailsSidebar";

export function EditPersonDetailsForm() {
  const { setFieldValue, values } = useFormikContext<EditPersonalDataForm>();
  const validateLength = useValidateLength();

  async function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;
    const currentLanguages = values.consultationLanguage ?? [];
    const german = ApiPersonLanguage.German;

    if (isChecked) {
      // Add German at the beginning if not present
      const updatedLanguages = currentLanguages.includes(german)
        ? currentLanguages
        : [german, ...currentLanguages];
      await setFieldValue("consultationLanguage", updatedLanguages);
      await setFieldValue("hasSufficientGermanLanguageSkills", true);
    } else {
      // Remove German from the list
      await setFieldValue(
        "consultationLanguage",
        currentLanguages.filter((lang: ApiPersonLanguage) => lang !== german),
      );
      await setFieldValue("hasSufficientGermanLanguageSkills", false);
    }
  }

  async function handleSelectChange(value: string[]) {
    const german = ApiPersonLanguage.German;
    const hasGerman = value.includes(german);

    // Sync checkbox state with German presence in languages
    if (values.hasSufficientGermanLanguageSkills !== hasGerman) {
      await setFieldValue("hasSufficientGermanLanguageSkills", hasGerman);
    }

    // Keep German at the beginning if present
    if (hasGerman) {
      const withoutGerman = value.filter((lang) => lang !== german);
      await setFieldValue("consultationLanguage", [german, ...withoutGerman]);
    } else {
      await setFieldValue("consultationLanguage", value);
    }
  }

  return (
    <Stack gap={2}>
      <InputField
        name="firstName"
        label="Vorname"
        validate={(value) => (value ? validateLength(1, 80)(value) : undefined)}
      />
      <InputField
        name="lastName"
        label="Nachname"
        required="Bitte einen Nachnamen angeben."
        validate={validateLength(1, 120)}
      />
      <InputField name="alias" label="Alias" validate={validateLength(1, 80)} />
      <DateField
        name="dateOfBirth"
        label="Geburtsdatum"
        validate={(value) => (value ? validateDateOfBirth(value) : undefined)}
      />
      <SelectField
        name="gender"
        label="Biologisches Geschlecht"
        options={GENDER_OPTIONS}
        required="Bitte ein Biologisches Geschlecht auswählen."
      />
      <CheckboxField
        name="hasSufficientGermanLanguageSkills"
        label="Ausreichende Deutschkenntnisse"
        onChange={handleCheckboxChange}
      />
      <SelectField
        name="consultationLanguage"
        label="Gesprochene Sprachen"
        options={LANGUAGE_OPTIONS}
        renderValue={(modules) => (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {modules.map((option) => (
              <Chip key={option.value} color="primary">
                {option.label}
              </Chip>
            ))}
          </Stack>
        )}
        multiple
        onChange={handleSelectChange}
      />
    </Stack>
  );
}
