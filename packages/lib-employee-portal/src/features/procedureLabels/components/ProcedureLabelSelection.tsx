/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";

import { ProcedureLabel } from "../api/models/ProcedureLabel";
import { ProcedureLabelClient } from "../types/procedureLabelClient";

import { ProcedureLabelAutocomplete } from "./ProcedureLabelAutocomplete";

interface ProcedureLabelSelectionProps {
  onChange?: (newValue: ProcedureLabel[]) => void;
  procedureLabelApi: ProcedureLabelClient;
  procedureLabelApiQueryKey: QueryKeyFactory;
}

export function ProcedureLabelSelection(props: ProcedureLabelSelectionProps) {
  const field = useBaseField<ProcedureLabel[]>({
    name: "procedureLabels",
  });

  return (
    <BaseField label="Kennungen">
      <ProcedureLabelAutocomplete
        name={field.input.name}
        value={field.input.value}
        procedureLabelApi={props.procedureLabelApi}
        procedureLabelApiQueryKey={props.procedureLabelApiQueryKey}
        onChange={(newValue) => {
          void field.helpers.setValue(newValue);
          props.onChange?.(newValue);
        }}
      />
    </BaseField>
  );
}
