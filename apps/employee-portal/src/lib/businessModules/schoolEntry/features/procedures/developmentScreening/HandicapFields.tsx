/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  DebouncedTextareaField,
  NestedFormProps,
  OptionalFieldValue,
  SetFieldValueHelper,
  SoftRequiredSelectField,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import { ApiDisabilityType } from "@eshg/school-entry-api";

import {
  HandicapWithDiagnosisFieldValues,
  HandicapWithDiagnosisFields,
} from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/HandicapWithDiagnosisFields";
import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import { ClickIcd10CodeHandler } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/Icd10CodeField";
import { SetAllBooleanSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { DISABILITY_TYPE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";
import { REQUIRED_PROCEDURE_PROPERTIES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

const DISABILITY_TYPE_STYLE: SxProps = {
  ".MuiSelect-root": { width: "314px" },
  width: "463px",
};

interface HandicapFieldsProps extends NestedFormProps {
  values: HandicapFieldsValues;
  setFieldValue: SetFieldValueHelper;
  onClickIcd10Code: ClickIcd10CodeHandler;
}

export interface HandicapFieldsValues {
  chronicDisease: HandicapWithDiagnosisFieldValues;
  disability: HandicapWithDiagnosisFieldValues;
  disabilityType: OptionalFieldValue<ApiDisabilityType>;
  note: string;
}

export function HandicapFields(props: HandicapFieldsProps) {
  const fieldName = createFieldNameMapper(props.name);

  function setAll(newValue: OptionalFieldValue<boolean>) {
    void props.setFieldValue(fieldName("chronicDisease.result"), newValue);
    void props.setFieldValue(fieldName("disability.result"), newValue);
    if (!newValue) {
      void props.setFieldValue(fieldName("chronicDisease.icd10Codes"), []);
      void props.setFieldValue(fieldName("disability.icd10Codes"), []);
      void props.setFieldValue(fieldName("disabilityType"), "");
    }
  }

  function resetDisabilityType() {
    void props.setFieldValue(fieldName("disabilityType"), "");
  }

  return (
    <Stack
      gap={2}
      data-testid="handicapForm"
      role="group"
      aria-labelledby="handicap-label"
    >
      <Typography level="title-sm" component="h2" id="handicap-label">
        Handicap
      </Typography>
      <Stack direction="row" gap={4} alignItems="flex-start" flexWrap="wrap">
        <SetAllBooleanSelect
          label="Alle"
          sx={BOOLEAN_SELECT_STYLE}
          onChange={setAll}
        />
        <Stack gap={1}>
          <HandicapWithDiagnosisFields
            name={fieldName("chronicDisease")}
            label={
              REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_CHRONIC_DISEASE_RESULT
            }
            values={props.values.chronicDisease}
            setFieldValue={props.setFieldValue}
            onClickIcd10Code={props.onClickIcd10Code}
          />
          <HandicapWithDiagnosisFields
            name={fieldName("disability")}
            label={
              REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_DISABILITY_RESULT
            }
            values={props.values.disability}
            setFieldValue={props.setFieldValue}
            onClickIcd10Code={props.onClickIcd10Code}
            onResetResult={resetDisabilityType}
          />
          <SoftRequiredSelectField
            name={fieldName("disabilityType")}
            label={
              <FlexLabel>
                {
                  REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_DISABILITY_TYPE
                }
              </FlexLabel>
            }
            options={DISABILITY_TYPE_OPTIONS}
            sx={DISABILITY_TYPE_STYLE}
            disabled={!props.values.disability.result}
            softRequired
          />
        </Stack>
      </Stack>
      <DebouncedTextareaField name={fieldName("note")} label="Bemerkung" />
    </Stack>
  );
}
