/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { LabelAutocomplete } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/LabelAutocomplete";

interface LabelSelectionProps {
  onChange?: (newValue: Label[]) => void;
}

export function LabelSelection(props: LabelSelectionProps) {
  const field = useBaseField<Label[]>({ name: "labels" });

  return (
    <BaseField label="Kennungen">
      <LabelAutocomplete
        name={field.input.name}
        value={field.input.value}
        onChange={(newValue) => {
          void field.helpers.setValue(newValue);
          props.onChange?.(newValue);
        }}
      />
    </BaseField>
  );
}
