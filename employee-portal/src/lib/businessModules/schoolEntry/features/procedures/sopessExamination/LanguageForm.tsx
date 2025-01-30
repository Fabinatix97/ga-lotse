/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoftRequiredSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { ApiPrimaryLanguageValue } from "@eshg/school-entry-api";
import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

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
  ".MuiSelect-root": { width: "70px" },
};

interface LanguageFormProps {
  values: LanguageValues;
}

export function LanguageForm(props: LanguageFormProps) {
  const fieldName = createFieldNameMapper("language");
  const primaryLanguageIsGerman =
    props.values.primaryLanguage !== ApiPrimaryLanguageValue.German;

  return (
    <Stack gap={2} data-testid="languageForm">
      <Typography level="title-sm">Sprache</Typography>
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
          softRequired={primaryLanguageIsGerman}
        />
        <SoftRequiredSelectField
          name={fieldName("familyLanguage")}
          label="Familiensprache"
          options={FAMILY_LANGUAGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FAMILY_LANGUAGE_STYLE}
          softRequired={primaryLanguageIsGerman}
        />
        <SoftRequiredSelectField
          name={fieldName("germanKnowledgeChild")}
          label="Deutschkenntnisse"
          options={GERMAN_KNOWLEDGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FIXED_WIDTH_STYLE}
          softRequired={primaryLanguageIsGerman}
        />
      </Stack>
    </Stack>
  );
}
