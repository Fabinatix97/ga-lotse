/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";

import { SaveDiagramStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SaveDiagramStep/saveDiagramStepFormModel";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

export function SaveDiagramStep() {
  const fieldName = createFieldNameMapper<SaveDiagramStepFormModel>();

  return (
    <Stack gap={2}>
      <InputField
        name={fieldName("title")}
        label="Diagrammtitel"
        required="Bitte Titel angeben."
      />
      <TextareaField name={fieldName("description")} label="Beschreibung" />
    </Stack>
  );
}
