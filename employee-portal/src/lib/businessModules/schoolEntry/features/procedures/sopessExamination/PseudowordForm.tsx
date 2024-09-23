/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiSopessExaminationResultValue } from "@eshg/employee-portal-api/schoolEntry";
import { SoftRequiredNumberField } from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";

import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import { FIXED_WIDTH_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { FormSectionTitle } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/FormSectionTitle";
import { SopessExaminationFields } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationFields";
import {
  MAX_9,
  MIN_0,
  validateValue,
} from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationForm";
import { EVALUATION_EXAMINATION_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface PseudowordFormProps {
  points: OptionalFieldValue<number>;
  result: OptionalFieldValue<ApiSopessExaminationResultValue>;
  setFieldValue: SetFieldValueHelper;
}

function mapExaminationEvaluation(value: OptionalFieldValue<number>): string {
  if (value === "") {
    return "";
  } else if (value < 0) {
    return "";
  } else if (value <= 3) {
    return EVALUATION_EXAMINATION_TYPES.CONSPICUOUS;
  } else if (value === 4) {
    return EVALUATION_EXAMINATION_TYPES.BORDERLINE;
  } else if (value <= 6) {
    return EVALUATION_EXAMINATION_TYPES.INCONSPICUOUS;
  } else if (value === 9) {
    return EVALUATION_EXAMINATION_TYPES.UNKNOWN;
  }
  return "";
}

function validatePseudoword(value: OptionalFieldValue<number>) {
  return validateValue(value, 6, 9);
}

export function PseudowordForm(props: PseudowordFormProps) {
  const fieldName = createFieldNameMapper("auditiveProcessing");

  return (
    <Stack gap={2} data-testid="pseudowordForm">
      <FormSectionTitle
        title="Pseudowörter"
        tooltip="(0-3 auffall, 4 grenz, 5-6 unauff, 9 - unbekannt)"
      />
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Stack direction="row" gap={2}>
          <SoftRequiredNumberField
            name={fieldName("points")}
            label="Punkte"
            sx={FIXED_WIDTH_STYLE}
            validate={validatePseudoword}
            min={MIN_0}
            max={MAX_9}
            softRequired
          />
          <StatusChip aria-label="Bewertung Pseudowörter" minWidth="sm">
            {mapExaminationEvaluation(props.points)}
          </StatusChip>
        </Stack>
        <Stack direction="row" gap={2}>
          <SopessExaminationFields
            examinationResultName={fieldName("result")}
            examinationResultLabel="Auditive Infoverarbeitung"
            responseName={fieldName("doctorLetter")}
            examinationResultValue={props.result}
            setFieldValue={props.setFieldValue}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
