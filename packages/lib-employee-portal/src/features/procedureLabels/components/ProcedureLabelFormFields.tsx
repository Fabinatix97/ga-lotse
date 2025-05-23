/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";

import {
  InputField,
  OptionalFieldValue,
  TextareaField,
  useValidateLength,
} from "@eshg/lib-portal";

export interface ProcedureLabelValues {
  name: string;
  description: OptionalFieldValue<string>;
}

export function ProcedureLabelFormFields() {
  const validateLength = useValidateLength();

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
