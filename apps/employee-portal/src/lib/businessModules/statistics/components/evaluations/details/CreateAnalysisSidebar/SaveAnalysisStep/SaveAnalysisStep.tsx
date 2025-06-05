/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { InputField } from "@eshg/lib-portal";

import { SaveAnalysisStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SaveAnalysisStep/saveAnalysisStepFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

export function SaveAnalysisStep(
  props: SidebarStepContentProps<SaveAnalysisStepFormModel>,
) {
  return (
    <Stack gap={2}>
      <InputField
        name={props.fieldName("name")}
        label="Name der Analyse"
        required="Bitte Name angeben."
      />
    </Stack>
  );
}
