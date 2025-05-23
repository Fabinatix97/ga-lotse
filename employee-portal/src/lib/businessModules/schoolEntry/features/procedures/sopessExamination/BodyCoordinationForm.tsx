/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  OptionalFieldValue,
  SetFieldValueHelper,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import { SoftRequiredNumberField } from "@eshg/lib-portal/components/form/fieldVariants";
import {
  ApiDoctorLetterValue,
  ApiSopessExaminationResultValue,
} from "@eshg/school-entry-api";

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

interface BodyCoordinationFormProps {
  points: OptionalFieldValue<number>;
  result: OptionalFieldValue<ApiSopessExaminationResultValue>;
  setFieldValue: SetFieldValueHelper;
}

function mapExaminationEvaluation(value: OptionalFieldValue<number>): string {
  if (value === "") {
    return "";
  } else if (value < 0) {
    return "";
  } else if (value <= 6) {
    return EVALUATION_EXAMINATION_TYPES.CONSPICUOUS;
  } else if (value <= 8) {
    return EVALUATION_EXAMINATION_TYPES.BORDERLINE;
  } else if (value <= 30) {
    return EVALUATION_EXAMINATION_TYPES.INCONSPICUOUS;
  } else if (value == 99) {
    return EVALUATION_EXAMINATION_TYPES.UNKNOWN;
  }
  return "";
}

function validateJumpCount(value: OptionalFieldValue<number>) {
  return validateValue(value, 30, 99);
}

export function BodyCoordinationForm(props: BodyCoordinationFormProps) {
  const fieldName = createFieldNameMapper("grossMotorSkills");

  function handleJumpCountChange(value: OptionalFieldValue<number>) {
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
    <Stack gap={2} data-testid="bodyCoordinationForm">
      <FormSectionTitle
        title="Körperkoordination"
        tooltip="(0-6 auffall, 7-8 grenz, 9-30 unauff, 99 - unbekannt)"
      />
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Stack direction="row" gap={2}>
          <SoftRequiredNumberField
            label="Sprungzahl"
            name={fieldName("points")}
            sx={FIXED_WIDTH_STYLE}
            validate={validateJumpCount}
            softRequired
            min={MIN_0}
            max={MAX_99}
            onChange={handleJumpCountChange}
          />
          <StatusChip aria-label="Bewertung Sprungzahl" minWidth="sm">
            {mapExaminationEvaluation(props.points)}
          </StatusChip>
        </Stack>
        <Stack direction="row" gap={2}>
          <SopessExaminationFields
            examinationResultName={fieldName("result")}
            examinationResultLabel="Grobmotorik"
            responseName={fieldName("doctorLetter")}
            examinationResultValue={props.result}
            setFieldValue={props.setFieldValue}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
