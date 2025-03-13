/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Autocomplete, AutocompleteOption } from "@mui/joy";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { useGetLabels } from "@/lib/businessModules/schoolEntry/api/queries/labelApi";
import { ChipWithTooltip } from "@/lib/shared/components/chip/ChipWithTooltip";

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
      aria-description="Mehrfachauswahl möglich"
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
          <ChipWithTooltip
            key={label.id}
            name={label.name}
            hexColor={label.hexColor}
            modalTitle="Kennung"
          />
        </AutocompleteOption>
      )}
      renderTags={(tags, props) =>
        tags.map((label, index) => (
          <ChipWithTooltip
            {...props({ index })}
            key={label.id}
            name={label.name}
            hexColor={label.hexColor}
            modalTitle="Kennung"
          />
        ))
      }
    />
  );
}
