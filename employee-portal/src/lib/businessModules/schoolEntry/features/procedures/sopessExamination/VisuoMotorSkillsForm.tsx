/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoftRequiredNumberField } from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import {
  ApiDoctorLetterValue,
  ApiSopessExaminationResultValue,
} from "@eshg/school-entry-api";
import { Stack } from "@mui/joy";

import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import { FIXED_WIDTH_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { FormSectionTitle } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/FormSectionTitle";
import { SopessExaminationFields } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationFields";
import {
  MAX_99,
  MIN_0,
  mapExaminationEvaluationToExaminationResultValue,
  validateValue,
} from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationForm";
import { EVALUATION_EXAMINATION_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface VisuoMotorSkillsFormProps {
  points: OptionalFieldValue<number>;
  result: OptionalFieldValue<ApiSopessExaminationResultValue>;
  setFieldValue: SetFieldValueHelper;
}

function mapExaminationEvaluation(value: OptionalFieldValue<number>): string {
  if (value === "") {
    return "";
  } else if (value < 0) {
    return "";
  } else if (value <= 4) {
    return EVALUATION_EXAMINATION_TYPES.CONSPICUOUS;
  } else if (value <= 6) {
    return EVALUATION_EXAMINATION_TYPES.BORDERLINE;
  } else if (value <= 12) {
    return EVALUATION_EXAMINATION_TYPES.INCONSPICUOUS;
  } else if (value == 99) {
    return EVALUATION_EXAMINATION_TYPES.UNKNOWN;
  }
  return "";
}

function validateVisuoMotor(value: OptionalFieldValue<number>) {
  return validateValue(value, 12, 99);
}

export function VisuoMotorSkillsForm(props: VisuoMotorSkillsFormProps) {
  const fieldName = createFieldNameMapper("fineMotorSkills");

  function handleVisuoMotorChange(value: OptionalFieldValue<number>) {
    const examinationEvaluation = mapExaminationEvaluation(value);
    void props.setFieldValue(
      fieldName("result"),
      mapExaminationEvaluationToExaminationResultValue(examinationEvaluation),
    );
    if (examinationEvaluation !== EVALUATION_EXAMINATION_TYPES.CONSPICUOUS) {
      void props.setFieldValue(fieldName("doctorLetter"), "");
    } else {
      void props.setFieldValue(
        fieldName("doctorLetter"),
        ApiDoctorLetterValue.NoReply,
      );
    }
  }

  return (
    <Stack gap={2} data-testid="visuomotorSkillsForm">
      <FormSectionTitle
        title="Visuomotorik"
        tooltip="(0-4 auffall, 5-6 grenz, 7-12 unauff, 99 - unbekannt)"
      />
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Stack direction="row" gap={2}>
          <SoftRequiredNumberField
            name={fieldName("points")}
            label="Punkte"
            sx={FIXED_WIDTH_STYLE}
            onChange={handleVisuoMotorChange}
            validate={validateVisuoMotor}
            min={MIN_0}
            max={MAX_99}
            softRequired
          />
          <StatusChip aria-label="Bewertung Visuomotorik" minWidth="sm">
            {mapExaminationEvaluation(props.points)}
          </StatusChip>
        </Stack>
        <Stack direction="row" gap={2}>
          <SopessExaminationFields
            examinationResultName={fieldName("result")}
            examinationResultLabel="Feinmotorik"
            responseName={fieldName("doctorLetter")}
            examinationResultValue={props.result}
            setFieldValue={props.setFieldValue}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
