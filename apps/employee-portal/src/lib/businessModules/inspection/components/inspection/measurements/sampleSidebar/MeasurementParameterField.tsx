/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, createFilterOptions } from "@mui/joy";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { SelectObjectField } from "@eshg/lib-portal";

import {
  useAutocompleteParameterQuery,
  useAutocompleteParameterRegulationQuery,
} from "@/lib/businessModules/inspection/api/queries/autocomplete";
import { InspectionSampleSidebarFormType } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarHelper";

export interface ParameterFieldProps {
  name: string;
  label: string;
  required?: string;
  placeholder?: string;
  index: number;
}

export function MeasurementParameterField(props: ParameterFieldProps) {
  const { values, setFieldValue } =
    useFormikContext<InspectionSampleSidebarFormType>();
  const [parameterInputValue, setParameterInputValue] = useState("");
  const [parameterQuery] = useDebounce(parameterInputValue, 100);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );

  const selectedParameterZid =
    values.measurementParameters[props.index]?.parent?.value ?? "";

  const query = useAutocompleteParameterQuery({ prefix: parameterQuery });

  useEffect(() => {
    if (!query.isSuccess) return;
    setOptions(
      query.data.elements.map((element) => ({
        label: element.name,
        value: element.zid,
      })),
    );
  }, [query.isSuccess, query.data]);

  const queryRegulations = useAutocompleteParameterRegulationQuery({
    parameterZid: selectedParameterZid,
  });
  const regulations = queryRegulations.isSuccess
    ? queryRegulations.data.elements.map((element) => ({
        label: element.name,
        value: element.zid,
      }))
    : [];

  return (
    <Stack sx={{ flex: 1 }} gap={2}>
      <SelectObjectField
        {...props}
        filterOptions={createFilterOptions({ matchFrom: "start" })}
        name={props.name + ".parent"}
        loading={query.isLoading}
        options={options}
        sx={{ flex: 1 }}
        getOptionLabel={(option) => option.label}
        getOptionKey={(option) => option.value}
        isOptionEqualToValue={(option, value) => value.value === option.value}
        onInputChange={(e, value) => setParameterInputValue(value)}
        onValueChanged={async (value) => {
          if (value) {
            await setFieldValue(props.name + ".parent", value);
            await setFieldValue(props.name + ".child", {
              label: "",
              value: null,
            });
          }
        }}
      />
      {selectedParameterZid !== "" && regulations.length > 0 && (
        <SelectObjectField
          placeholder="Verordnung auswählen"
          label={props.label + " Verordnung"}
          name={props.name + ".child"}
          loading={queryRegulations.isLoading}
          options={regulations}
          sx={{ flex: 1 }}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) => option.label}
          getOptionKey={(option) => option.value}
        />
      )}
    </Stack>
  );
}
