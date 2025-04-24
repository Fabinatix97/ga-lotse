/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";

import { TextareaField } from "@/components/formFields/TextareaField";

export interface ProcedureLabelValues {
  name: string;
  description: OptionalFieldValue<string>;
}

export function ProcedureLabelFormFields() {
  const { validateLength } = useValidators();

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
