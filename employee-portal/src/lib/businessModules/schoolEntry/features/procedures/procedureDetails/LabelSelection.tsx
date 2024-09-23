/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { Autocomplete, AutocompleteOption } from "@mui/joy";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { useGetLabels } from "@/lib/businessModules/schoolEntry/api/queries/labelApi";
import { LabelChip } from "@/lib/businessModules/schoolEntry/features/labels/LabelChip";

interface LabelSelectionProps {
  onChange: (newValue: Label[]) => void;
}

export function LabelSelection(props: LabelSelectionProps) {
  const labelsQuery = useGetLabels();
  const field = useBaseField<Label[]>({ name: "labels" });

  return (
    <BaseField label="Kennungen">
      <Autocomplete
        name={field.input.name}
        multiple
        placeholder="Kennung"
        options={labelsQuery.data}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={field.input.value}
        onChange={(_, newValue) => {
          void field.helpers.setValue(newValue);
          props.onChange(newValue);
        }}
        renderOption={(props, label) => (
          <AutocompleteOption {...props} key={label.id}>
            <LabelChip label={label} />
          </AutocompleteOption>
        )}
        renderTags={(tags, props) =>
          tags.map((label, index) => (
            <LabelChip {...props({ index })} key={label.id} label={label} />
          ))
        }
      />
    </BaseField>
  );
}
