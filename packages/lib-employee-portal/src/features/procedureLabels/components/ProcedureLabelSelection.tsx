/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";

import { ProcedureLabel } from "@/features/procedureLabels/api/models/ProcedureLabel";
import { ProcedureLabelAutocomplete } from "@/features/procedureLabels/components/ProcedureLabelAutocomplete";
import { ProcedureLabelClient } from "@/features/procedureLabels/types/procedureLabelClient";

interface ProcedureLabelSelectionProps {
  onChange?: (newValue: ProcedureLabel[]) => void;
  procedureLabelApi: ProcedureLabelClient;
  procedureLabelApiQueryKey: QueryKeyFactory;
}

export function ProcedureLabelSelection(props: ProcedureLabelSelectionProps) {
  const field = useBaseField<ProcedureLabel[]>({ name: "labels" });

  return (
    <BaseField label="Kennungen">
      <ProcedureLabelAutocomplete
        name={field.input.name}
        value={field.input.value}
        onChange={(newValue) => {
          void field.helpers.setValue(newValue);
          props.onChange?.(newValue);
        }}
        procedureLabelApi={props.procedureLabelApi}
        procedureLabelApiQueryKey={props.procedureLabelApiQueryKey}
      />
    </BaseField>
  );
}
