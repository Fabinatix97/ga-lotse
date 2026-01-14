/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { InputField, TextareaField } from "@eshg/lib-portal";

import { SaveDiagramStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SaveDiagramStep/saveDiagramStepFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

export function SaveDiagramStep(
  props: SidebarStepContentProps<SaveDiagramStepFormModel>,
) {
  return (
    <Stack gap={2}>
      <InputField
        autoFocus
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
