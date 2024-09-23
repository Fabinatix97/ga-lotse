/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";

import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

export interface LabelValues {
  name: string;
  description: OptionalFieldValue<string>;
}

export function LabelFormFields() {
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
