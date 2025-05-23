/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutocompleteOption } from "@mui/joy";

import { CustomAutocomplete, QueryKeyFactory } from "@eshg/lib-portal";

import { ProcedureLabel } from "../api/models/ProcedureLabel";
import { useGetProcedureLabels } from "../api/queries";
import { ProcedureLabelClient } from "../types/procedureLabelClient";

import { ProcedureLabelChip } from "./ProcedureLabelChip";

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
      renderOption={(props, label) => (
        <AutocompleteOption {...props} key={label.id}>
          <ProcedureLabelChip value={label} />
        </AutocompleteOption>
      )}
      renderTags={(tags, props) =>
        tags.map((label, index) => (
          <ProcedureLabelChip
            {...props({ index })}
            key={label.id}
            value={label}
          />
        ))
      }
      onChange={(_, newValue) => {
        props.onChange(newValue);
      }}
    />
  );
}
