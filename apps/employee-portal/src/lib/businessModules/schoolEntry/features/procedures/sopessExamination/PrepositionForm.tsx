/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  OptionalFieldValue,
  SoftRequiredNumberField,
  createFieldNameMapper,
} from "@eshg/lib-portal";

import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import { FIXED_WIDTH_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { FormSectionTitle } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/FormSectionTitle";
import {
  MAX_9,
  MIN_0,
  validateValue,
} from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationForm";
import { EVALUATION_EXAMINATION_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface PrepositionFormProps {
  prepositionPoints: OptionalFieldValue<number>;
}

function mapExaminationEvaluation(value: OptionalFieldValue<number>): string {
  if (value === "") {
    return "";
  } else if (value < 0) {
    return "";
  } else if (value <= 4) {
    return EVALUATION_EXAMINATION_TYPES.CONSPICUOUS;
  } else if (value === 5) {
    return EVALUATION_EXAMINATION_TYPES.BORDERLINE;
  } else if (value <= 8) {
    return EVALUATION_EXAMINATION_TYPES.INCONSPICUOUS;
  } else if (value === 9) {
    return EVALUATION_EXAMINATION_TYPES.UNKNOWN;
  }
  return "";
}

function validatePreposition(value: OptionalFieldValue<number>) {
  return validateValue(value, 8, 9);
}

export function PrepositionForm(props: PrepositionFormProps) {
  const fieldName = createFieldNameMapper("speech");

  return (
    <Stack gap={2} data-testid="prepositionForm">
      <FormSectionTitle
        title="Präpositionen"
        tooltip="(0-4 auffall, 5 grenz, 6-8 unauff, 9 - unbekannt)"
      />
      <Stack direction="row" gap={2}>
        <SoftRequiredNumberField
          name={fieldName("prepositionPoints")}
          label="Punkte"
          sx={FIXED_WIDTH_STYLE}
          validate={validatePreposition}
          min={MIN_0}
          max={MAX_9}
          softRequired
        />
        <StatusChip aria-label="Bewertung Präpositionen" minWidth="sm">
          {mapExaminationEvaluation(props.prepositionPoints)}
        </StatusChip>
      </Stack>
    </Stack>
  );
}
