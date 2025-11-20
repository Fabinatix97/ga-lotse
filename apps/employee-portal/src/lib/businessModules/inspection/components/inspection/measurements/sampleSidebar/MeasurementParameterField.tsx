/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useState } from "react";
import { useDebounce } from "use-debounce";

import {
  SingleAutocompleteField,
  SingleAutocompleteFieldProps,
} from "@eshg/lib-portal";

import { useAutocompleteParameterQuery } from "@/lib/businessModules/inspection/api/queries/autocomplete";

export type ParameterFieldProps = Omit<
  SingleAutocompleteFieldProps,
  "options" | "loading" | "freeSolo"
>;

export function MeasurementParameterField(props: ParameterFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [parameterQuery] = useDebounce(inputValue, 100);

  const query = useAutocompleteParameterQuery({ prefix: parameterQuery });

  const options = query.isSuccess
    ? query.data.elements.map((element) => ({
        label: element.name,
        value: element.zid,
      }))
    : [];

  return (
    <SingleAutocompleteField
      loading={query.isLoading}
      fetching={query.isFetching}
      options={options}
      sx={{ flex: 1 }}
      onChange={(value) => setInputValue(value)}
      {...props}
    />
  );
}
