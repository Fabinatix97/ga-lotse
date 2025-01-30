/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoftRequiredNumberField } from "@eshg/lib-portal/components/form/fieldVariants";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";

import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import { FIXED_WIDTH_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { FormSectionTitle } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/FormSectionTitle";
import {
  MAX_99,
  MIN_0,
  validateValue,
} from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationForm";
import { EVALUATION_EXAMINATION_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface CountingFormProps {
  countingPoints: OptionalFieldValue<number>;
}

function mapExaminationEvaluation(value: OptionalFieldValue<number>): string {
  if (value === "") {
    return "";
  } else if (value < 0) {
    return "";
  } else if (value <= 12) {
    return EVALUATION_EXAMINATION_TYPES.CONSPICUOUS;
  } else if (value <= 16) {
    return EVALUATION_EXAMINATION_TYPES.BORDERLINE;
  } else if (value <= 20) {
    return EVALUATION_EXAMINATION_TYPES.INCONSPICUOUS;
  } else if (value === 99) {
    return EVALUATION_EXAMINATION_TYPES.UNKNOWN;
  }
  return "";
}

function validateCounting(value: OptionalFieldValue<number>) {
  return validateValue(value, 20, 99);
}

export function CountingForm(props: CountingFormProps) {
  const fieldName = createFieldNameMapper("knowledgeThinking");

  return (
    <Stack gap={2} data-testid="countingForm">
      <FormSectionTitle
        title="Zählen"
        tooltip="(0-12 auffall, 13-16 grenz, 17-20 unauff, 99 - unbekannt)"
      />
      <Stack direction="row" gap={2}>
        <SoftRequiredNumberField
          name={fieldName("countingPoints")}
          label="Punkte"
          sx={FIXED_WIDTH_STYLE}
          validate={validateCounting}
          min={MIN_0}
          max={MAX_99}
          softRequired
        />
        <StatusChip aria-label="Bewertung Zählen" minWidth="sm">
          {mapExaminationEvaluation(props.countingPoints)}
        </StatusChip>
      </Stack>
    </Stack>
  );
}
