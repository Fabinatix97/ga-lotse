/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { CustomAutocomplete } from "@eshg/lib-portal/components/inputs/CustomAutocomplete";
import { AutocompleteOption } from "@mui/joy";

import { ChipWithTooltip } from "@/components/chip/ChipWithTooltip";
import { ProcedureLabel } from "@/features/procedureLabels/api/models/ProcedureLabel";
import { useGetProcedureLabels } from "@/features/procedureLabels/api/queries";
import { ProcedureLabelClient } from "@/features/procedureLabels/types/procedureLabelClient";

interface ProcedureLabelAutocompleteProps {
  name: string;
  value: ProcedureLabel[];
  onChange: (newValue: ProcedureLabel[]) => void;
  procedureLabelApi: ProcedureLabelClient;
  procedureLabelApiQueryKey: QueryKeyFactory;
}

export function ProcedureLabelAutocomplete(
  props: ProcedureLabelAutocompleteProps,
) {
  const labelsQuery = useGetProcedureLabels(
    props.procedureLabelApi,
    props.procedureLabelApiQueryKey,
  );

  return (
    <CustomAutocomplete
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
