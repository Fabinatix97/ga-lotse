/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, Divider, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { ChangeEvent } from "react";

import {
  CheckboxField,
  DateField,
  InputField,
  SelectField,
  buildEnumOptions,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";
import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

import {
  DOCUMENT_TYPE_VALUES,
  LANGUAGE_OPTIONS,
  NATIONALITY_OPTIONS,
  PERSON_FIELD_NAME,
} from "../../../../shared/constants";

import { EditPersonalDataForm } from "./EditPersonDetailsSidebar";

export function EditPersonDetailsForm() {
  const { setFieldValue, values } = useFormikContext<EditPersonalDataForm>();
  const validateLength = useValidateLength();

  async function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;
    const languages = values.languages ?? [];
    const german = ApiPersonLanguage.German;

    if (isChecked) {
      const updatedLanguages = languages.includes(german)
        ? languages
        : [german, ...languages];
      await setFieldValue("languages", updatedLanguages);
      await setFieldValue("hasSufficientGermanLanguageSkills", true);
    } else {
      await setFieldValue(
        "languages",
        languages.filter((lang: ApiPersonLanguage) => lang !== german),
      );
      await setFieldValue("hasSufficientGermanLanguageSkills", false);
    }
  }

  async function handleSelectChange(value: string[]) {
    const german = ApiPersonLanguage.German;
    const hasGerman = value.includes(german);

    if (values.hasSufficientGermanLanguageSkills !== hasGerman) {
      await setFieldValue("hasSufficientGermanLanguageSkills", hasGerman);
    }

    if (hasGerman) {
      const withoutGerman = value.filter((lang) => lang !== german);
      await setFieldValue("languages", [german, ...withoutGerman]);
    } else {
      await setFieldValue("languages", value);
    }
  }

  return (
    <Stack gap={2}>
      <InputField
        name="firstName"
        label={PERSON_FIELD_NAME.firstName}
        validate={(value) => (value ? validateLength(1, 80)(value) : undefined)}
      />
      <InputField
        name="lastName"
        label={PERSON_FIELD_NAME.lastName}
        required="Bitte einen Nachnamen angeben."
        validate={validateLength(1, 120)}
      />
      <InputField name="alias" label="Alias" validate={validateLength(1, 80)} />
      <DateField
        name="dateOfBirth"
        label={PERSON_FIELD_NAME.dateOfBirth}
        validate={(value) => (value ? validateDateOfBirth(value) : undefined)}
      />
      <Divider sx={{ marginBlock: 1 }} />
      <CheckboxField
        name="hasSufficientGermanLanguageSkills"
        label={PERSON_FIELD_NAME.hasSufficientGermanLanguageSkills}
        onChange={handleCheckboxChange}
      />
      <SelectField
        name="languages"
        label={PERSON_FIELD_NAME.languages}
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
      <SelectField
        name="nationality"
        label={PERSON_FIELD_NAME.nationality}
        options={NATIONALITY_OPTIONS}
      />
      <SelectField
        name="documentType"
        label={PERSON_FIELD_NAME.documentType}
        options={buildEnumOptions(DOCUMENT_TYPE_VALUES)}
      />
    </Stack>
  );
}
