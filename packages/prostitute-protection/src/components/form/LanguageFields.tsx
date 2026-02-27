/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { ChangeEvent } from "react";

import { CheckboxField, MultiAutocompleteField } from "@eshg/lib-portal";
import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

import { LANGUAGE_OPTIONS, PERSON_FIELD_NAME } from "../../shared/constants";

export interface LanguageFieldsData {
  languages: ApiPersonLanguage[];
  hasSufficientGermanLanguageSkills: boolean;
}

interface LanguageFieldsProps {
  isOtherLanguagesRequired?: boolean;
}

export function LanguageFields({}: LanguageFieldsProps) {
  const { values, setFieldValue } = useFormikContext<LanguageFieldsData>();

  async function handleLanguageChange(
    data: ApiPersonLanguage[],
    isChecked?: boolean,
  ) {
    const german = ApiPersonLanguage.German;
    const languagesSet = new Set(data);

    const hasGerman = isChecked ?? languagesSet.has(german);

    languagesSet.delete(german);
    const languages = hasGerman ? [german, ...languagesSet] : [...languagesSet];

    await setFieldValue("hasSufficientGermanLanguageSkills", hasGerman);
    await setFieldValue("languages", languages);
  }

  async function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;
    await handleLanguageChange(values.languages, isChecked);
  }

  async function handleSelectChange(value: string[]) {
    await handleLanguageChange(value as ApiPersonLanguage[]);
  }

  return (
    <>
      <CheckboxField
        name="hasSufficientGermanLanguageSkills"
        label={PERSON_FIELD_NAME.hasSufficientGermanLanguageSkills}
        onChange={handleCheckboxChange}
      />
      <MultiAutocompleteField
        name="languages"
        label={PERSON_FIELD_NAME.otherLanguages}
        options={LANGUAGE_OPTIONS}
        onChange={handleSelectChange}
      />
    </>
  );
}
