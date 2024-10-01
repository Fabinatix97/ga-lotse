/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Autocomplete, AutocompleteOption } from "@mui/joy";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { useGetLabels } from "@/lib/businessModules/schoolEntry/api/queries/labelApi";
import { LabelChip } from "@/lib/businessModules/schoolEntry/features/labels/LabelChip";

interface LabelAutocompleteProps {
  name: string;
  value: Label[];
  onChange: (newValue: Label[]) => void;
}

export function LabelAutocomplete(props: LabelAutocompleteProps) {
  const labelsQuery = useGetLabels();

  return (
    <Autocomplete
      name={props.name}
      multiple
      placeholder="Kennung"
      options={labelsQuery.data}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={props.value}
      onChange={(_, newValue) => {
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
  );
}
