/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDisabilityType } from "@eshg/employee-portal-api/schoolEntry";
import { SoftRequiredSelectField } from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  HandicapWithDiagnosisFieldValues,
  HandicapWithDiagnosisFields,
} from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/HandicapWithDiagnosisFields";
import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import { ClickIcd10CodeHandler } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/Icd10CodeField";
import { SetAllBooleanSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { DISABILITY_TYPE_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

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
    <>
      <Stack gap={2} data-testid="handicapForm">
        <Typography level="title-sm">Handicap</Typography>
        <Stack direction="row" gap={4} alignItems="flex-start" flexWrap="wrap">
          <SetAllBooleanSelect
            label="Alle"
            onChange={setAll}
            sx={BOOLEAN_SELECT_STYLE}
          />
          <Stack gap={1}>
            <HandicapWithDiagnosisFields
              name={fieldName("chronicDisease")}
              label="chron. Krankheit"
              values={props.values.chronicDisease}
              setFieldValue={props.setFieldValue}
              onClickIcd10Code={props.onClickIcd10Code}
            />
            <HandicapWithDiagnosisFields
              name={fieldName("disability")}
              label="Behinderung"
              values={props.values.disability}
              setFieldValue={props.setFieldValue}
              onClickIcd10Code={props.onClickIcd10Code}
              onResetResult={resetDisabilityType}
            />
            <SoftRequiredSelectField
              name={fieldName("disabilityType")}
              label={<FlexLabel>Behinderungs-Art</FlexLabel>}
              options={DISABILITY_TYPE_OPTIONS}
              sx={DISABILITY_TYPE_STYLE}
              disabled={!props.values.disability.result}
              softRequired
            />
          </Stack>
        </Stack>
        <TextareaField name={fieldName("note")} label="Bemerkung" />
      </Stack>
    </>
  );
}
