/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  OptionalFieldValue,
  SetFieldValueHelper,
  SoftRequiredNumberField,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import { ApiSopessExaminationResultValue } from "@eshg/school-entry-api";

import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import { FIXED_WIDTH_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { FormSectionTitle } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/FormSectionTitle";
import { SopessExaminationFields } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationFields";
import {
  MAX_99,
  MIN_0,
  validateValue,
} from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/SopessExaminationForm";
import {
  EVALUATION_EXAMINATION_TYPES,
  REQUIRED_PROCEDURE_PROPERTIES,
} from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface QuantityKnowledgeFormProps {
  quantityKnowledgePoints: OptionalFieldValue<number>;
  result: OptionalFieldValue<ApiSopessExaminationResultValue>;
  setFieldValue: SetFieldValueHelper;
}

function mapExaminationEvaluation(value: OptionalFieldValue<number>): string {
  if (value === "") {
    return "";
  } else if (value < 0) {
    return "";
  } else if (value <= 10) {
    return EVALUATION_EXAMINATION_TYPES.CONSPICUOUS;
  } else if (value <= 13) {
    return EVALUATION_EXAMINATION_TYPES.BORDERLINE;
  } else if (value <= 16) {
    return EVALUATION_EXAMINATION_TYPES.INCONSPICUOUS;
  } else if (value === 99) {
    return EVALUATION_EXAMINATION_TYPES.UNKNOWN;
  }
  return "";
}

function validateQuantityKnowledge(value: OptionalFieldValue<number>) {
  return validateValue(value, 16, 99);
}

export function QuantityKnowledgeForm(props: QuantityKnowledgeFormProps) {
  const fieldName = createFieldNameMapper("knowledgeThinking");

  return (
    <Stack
      gap={2}
      data-testid="quantityKnowledgeForm"
      role="group"
      aria-labelledby="menge-vorwissen-label"
    >
      <FormSectionTitle
        title="Mengenvorwissen"
        tooltip="(0-10 auffall, 11-13 grenz, 14-16 unauff, 99 - unbekannt)"
        id="menge-vorwissen-label"
      />
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Stack direction="row" gap={2}>
          <SoftRequiredNumberField
            name={fieldName("quantityKnowledgePoints")}
            label="Punkte"
            sx={FIXED_WIDTH_STYLE}
            validate={validateQuantityKnowledge}
            min={MIN_0}
            max={MAX_99}
            softRequired
          />
          <StatusChip aria-label="Bewertung Mengenvorwissen" minWidth="sm">
            {mapExaminationEvaluation(props.quantityKnowledgePoints)}
          </StatusChip>
        </Stack>
        <Stack direction="row" gap={2}>
          <SopessExaminationFields
            examinationResultName={fieldName("result")}
            examinationResultLabel={
              REQUIRED_PROCEDURE_PROPERTIES.SOPESS_EXAMINATION_KNOWLEDGE_THINKING_RESULT
            }
            responseName={fieldName("doctorLetter")}
            examinationResultValue={props.result}
            setFieldValue={props.setFieldValue}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
