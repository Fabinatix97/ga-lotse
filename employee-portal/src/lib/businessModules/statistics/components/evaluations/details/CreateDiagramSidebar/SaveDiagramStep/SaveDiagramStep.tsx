/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TextareaField } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Stack } from "@mui/joy";

import { SaveDiagramStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SaveDiagramStep/saveDiagramStepFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

export function SaveDiagramStep(
  props: SidebarStepContentProps<SaveDiagramStepFormModel>,
) {
  return (
    <Stack gap={2}>
      <InputField
        name={props.fieldName("title")}
        label="Diagrammtitel"
        required="Bitte Titel angeben."
      />
      <TextareaField
        name={props.fieldName("description")}
        label="Beschreibung"
      />
    </Stack>
  );
}
