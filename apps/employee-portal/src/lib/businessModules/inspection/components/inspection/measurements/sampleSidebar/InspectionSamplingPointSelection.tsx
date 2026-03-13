/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { SelectObjectField, SelectObjectFieldValue } from "@eshg/lib-portal";

import { useGetSamplingPointsQuery } from "@/lib/businessModules/inspection/api/queries/samplingPoints";

interface InspectionSamplingPointSelectionOption {
  label: string;
  value: string;
}

interface InspectionSamplingPointSelectionProps {
  facilityId?: string;
  onChange?: (
    value: SelectObjectFieldValue<
      InspectionSamplingPointSelectionOption,
      false
    >,
  ) => void;
}

export function InspectionSamplingPointSelection(
  props: InspectionSamplingPointSelectionProps,
) {
  const [inputValue, setInputValue] = useState("");
  const [parameterQuery] = useDebounce(inputValue, 100);
  const [options, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const query = useGetSamplingPointsQuery(parameterQuery, props.facilityId);

  useEffect(() => {
    if (!query.isSuccess) return;
    setOptions(
      query.data.map((element) => ({
        label: element.name,
        value: element.id,
      })),
    );
  }, [query.isSuccess, query.data]);

  return (
    <Stack direction="column" spacing={2}>
      <SelectObjectField
        {...props}
        label="Entnahmestelle"
        required="Entnahmestelle Auswählen"
        name="samplingPoint"
        loading={query.isLoading}
        options={options}
        sx={{ flex: 1 }}
        getOptionLabel={(option) => option.label}
        getOptionKey={(option) => option.value}
        isOptionEqualToValue={(option, value) => value.value === option.value}
        onInputChange={(e, value) => setInputValue(value)}
        onValueChanged={props.onChange}
      />
    </Stack>
  );
}
