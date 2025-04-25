/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, FormLabel } from "@mui/joy";

import {
  ProcedureLabel,
  ProcedureLabelAutocomplete,
} from "@eshg/lib-employee-portal";

import { procedureLabelApiQueryKey } from "@/config/apiQueryKeys";
import { useDentalApi } from "@/contexts/dental";

interface ProcedureLabelFilterProps {
  label: string;
  values?: ProcedureLabel[];
  onChange: (value: ProcedureLabel[]) => void;
}

export function ProcedureLabelFilter(props: ProcedureLabelFilterProps) {
  const { procedureLabelApi } = useDentalApi();
  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <ProcedureLabelAutocomplete
        name="labels"
        value={props.values ?? []}
        onChange={props.onChange}
        procedureLabelApi={procedureLabelApi}
        procedureLabelApiQueryKey={procedureLabelApiQueryKey}
      />
    </FormControl>
  );
}
