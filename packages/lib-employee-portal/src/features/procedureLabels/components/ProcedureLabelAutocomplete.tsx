/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutocompleteOption } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";

import { CustomAutocomplete, QueryKeyFactory } from "@eshg/lib-portal";

import { getEntityId, isSameEntity } from "../../../api/models/BaseEntity";
import { ProcedureLabel } from "../api/models/ProcedureLabel";
import { useGetProcedureLabelsQuery } from "../api/queries";
import { ProcedureLabelClient } from "../types/procedureLabelClient";

import { ProcedureLabelChip } from "./ProcedureLabelChip";

interface ProcedureLabelAutocompleteProps {
  name: string;
  value: ProcedureLabel[];
  onChange: (newValue: ProcedureLabel[]) => void;
  procedureLabelApi: ProcedureLabelClient;
  procedureLabelApiQueryKey: QueryKeyFactory;
  required?: boolean;
}

export function ProcedureLabelAutocomplete(
  props: ProcedureLabelAutocompleteProps,
) {
  const { data: procedureLabels, isFetching } = useQuery(
    useGetProcedureLabelsQuery(
      props.procedureLabelApi,
      props.procedureLabelApiQueryKey,
      // page size needs to be set - otherwise the default of 25 is used in the backend
      { pageSize: 1000 },
    ),
  );

  return (
    <CustomAutocomplete
      name={props.name}
      multiple
      placeholder="Kennung"
      required={props.required}
      getOptionKey={getEntityId}
      getOptionLabel={getProcedureLabelName}
      isOptionEqualToValue={isSameEntity}
      options={procedureLabels?.elements ?? []}
      value={props.value}
      loading={isFetching}
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

function getProcedureLabelName(procedureLabel: ProcedureLabel): string {
  return procedureLabel.name;
}
