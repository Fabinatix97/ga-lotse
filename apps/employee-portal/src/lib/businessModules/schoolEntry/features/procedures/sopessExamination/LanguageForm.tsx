/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  SoftRequiredSelectField,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import { ApiPrimaryLanguageValue } from "@eshg/school-entry-api";

import {
  FIXED_WIDTH_STYLE,
  getAbbreviation,
} from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import {
  FAMILY_LANGUAGE_OPTIONS,
  GERMAN_KNOWLEDGE_OPTIONS,
  LANGUAGE_KNOWLEDGE_OPTIONS,
  PRIMARY_LANGUAGE_OPTIONS,
} from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { LanguageValues } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationForm";

const FAMILY_LANGUAGE_STYLE: SxProps = {
  ".MuiSelect-root": { width: "75px" },
};

interface LanguageFormProps {
  values: LanguageValues;
}

export function LanguageForm(props: LanguageFormProps) {
  const fieldName = createFieldNameMapper("language");
  const primaryLanguageIsNotGerman =
    props.values.primaryLanguage !== ApiPrimaryLanguageValue.German;

  return (
    <Stack
      gap={2}
      data-testid="languageForm"
      role="group"
      aria-labelledby="language-label"
    >
      <Typography level="title-sm" component="h2" id="language-label">
        Sprache
      </Typography>
      <Stack direction="row" gap={3} flexWrap="wrap">
        <SoftRequiredSelectField
          name={fieldName("primaryLanguage")}
          label="Erstsprache"
          options={PRIMARY_LANGUAGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FIXED_WIDTH_STYLE}
          softRequired
        />
        <SoftRequiredSelectField
          name={fieldName("germanKnowledgePrimaryCarer")}
          label="Deutschkenntnisse Hauptbezugsperson"
          options={LANGUAGE_KNOWLEDGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FIXED_WIDTH_STYLE}
          softRequired={primaryLanguageIsNotGerman}
        />
        <SoftRequiredSelectField
          name={fieldName("familyLanguage")}
          label="Familiensprache"
          options={FAMILY_LANGUAGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FAMILY_LANGUAGE_STYLE}
          softRequired={primaryLanguageIsNotGerman}
        />
        <SoftRequiredSelectField
          name={fieldName("germanKnowledgeChild")}
          label="Deutschkenntnisse"
          options={GERMAN_KNOWLEDGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FIXED_WIDTH_STYLE}
          softRequired
        />
      </Stack>
    </Stack>
  );
}
