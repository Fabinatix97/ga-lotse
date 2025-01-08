/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";

import { SaveAnalysisStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SaveAnalysisStep/saveAnalysisStepFormModel";

export function SaveAnalysisStep() {
  const fieldName = createFieldNameMapper<SaveAnalysisStepFormModel>();

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
