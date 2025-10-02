/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormLabel, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useId } from "react";

import {
  MonthAndYearFields,
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
import { REQUIRED_PROCEDURE_PROPERTIES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

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
  const inGermanySinceId = useId();

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
          label={
            REQUIRED_PROCEDURE_PROPERTIES.SOPESS_EXAMINATION_PRIMARY_LANGUAGE
          }
          options={PRIMARY_LANGUAGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FIXED_WIDTH_STYLE}
          softRequired
        />
        <SoftRequiredSelectField
          name={fieldName("germanKnowledgePrimaryCarer")}
          label={
            REQUIRED_PROCEDURE_PROPERTIES.SOPESS_EXAMINATION_GERMAN_KNOWLEDGE_PRIMARY_CARER
          }
          options={LANGUAGE_KNOWLEDGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FIXED_WIDTH_STYLE}
          softRequired={primaryLanguageIsNotGerman}
        />
        <SoftRequiredSelectField
          name={fieldName("familyLanguage")}
          label={
            REQUIRED_PROCEDURE_PROPERTIES.SOPESS_EXAMINATION_FAMILY_LANGUAGE
          }
          options={FAMILY_LANGUAGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FAMILY_LANGUAGE_STYLE}
          softRequired={primaryLanguageIsNotGerman}
        />
        <SoftRequiredSelectField
          name={fieldName("germanKnowledgeChild")}
          label={
            REQUIRED_PROCEDURE_PROPERTIES.SOPESS_EXAMINATION_GERMAN_KNOWLEDGE_CHILD
          }
          options={GERMAN_KNOWLEDGE_OPTIONS}
          renderValue={getAbbreviation}
          sx={FIXED_WIDTH_STYLE}
          softRequired
        />
        <Stack direction="row" gap={2}>
          <FormLabel
            id={inGermanySinceId}
            sx={{ fontSize: "sm", fontWeight: "500" }}
          >
            {REQUIRED_PROCEDURE_PROPERTIES.SOPESS_EXAMINATION_IN_GERMANY_SINCE}
          </FormLabel>
          <MonthAndYearFields
            testId="inGermanySince"
            fieldName={fieldName("inGermanySince")}
            date={props.values.inGermanySince}
            aria-labelledby={inGermanySinceId}
            softRequired={primaryLanguageIsNotGerman}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
