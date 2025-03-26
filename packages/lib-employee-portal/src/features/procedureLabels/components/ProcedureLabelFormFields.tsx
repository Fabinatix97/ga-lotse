/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";

import { TextareaField } from "@/components/form/TextareaField";

export interface ProcedureLabelValues {
  name: string;
  description: OptionalFieldValue<string>;
}

export function ProcedureLabelFormFields() {
  return (
    <Stack gap={2}>
      <InputField
        label="Kennung"
        name="name"
        required="Bitte eine Kennung angeben."
        validate={validateLength(1, 255)}
      />
      <TextareaField label="Beschreibung" name="description" />
    </Stack>
  );
}
