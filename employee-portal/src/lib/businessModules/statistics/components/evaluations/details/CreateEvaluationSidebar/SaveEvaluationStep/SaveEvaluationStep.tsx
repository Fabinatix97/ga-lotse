/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";

import { SaveEvaluationStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateEvaluationSidebar/SaveEvaluationStep/saveEvaluationStepFormModel";

export function SaveEvaluationStep() {
  const fieldName = createFieldNameMapper<SaveEvaluationStepFormModel>();

  return (
    <Stack gap={2}>
      <InputField
        name={fieldName("name")}
        label="Name der Analyse"
        required="Bitte Name angeben."
      />
    </Stack>
  );
}
