/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { ApiAutocompleteActorResponseElementsInner } from "@eshg/inspection-api";
import {
  ButtonLink,
  SelectObjectField,
  SelectObjectFieldValue,
} from "@eshg/lib-portal";

import { useAutocompleteUserFacilityContactQuery } from "@/lib/businessModules/inspection/api/queries/autocomplete";

interface InspectionActorSelectionProps {
  useLaboratories: boolean;
  onSelfAssign: () => void;
  onFacilityAssign: () => void;
  name: string;
  label: string;
  required?: string;
  placeholder?: string;
  onChange?: (
    value: SelectObjectFieldValue<
      {
        label: string;
        value: string;
      },
      false
    >,
  ) => void;
}

export function InspectionActorSelection(props: InspectionActorSelectionProps) {
  const [inputValue, setInputValue] = useState("");
  const [parameterQuery] = useDebounce(inputValue, 100);

  const query = useAutocompleteUserFacilityContactQuery({
    prefix: parameterQuery,
    useLaboratories: props.useLaboratories,
  });

  const options = query.isSuccess
    ? query.data.elements.map((element) => ({
        label: getLabelOfOption(element),
        value: getValueOfOption(element),
      }))
    : [];

  function getValueOfOption(option: ApiAutocompleteActorResponseElementsInner) {
    switch (option.type) {
      case "AutocompleteContact":
        return option.contactId;
      case "InspectionSampleUserReference":
        return option.userId;
    }
  }

  function getLabelOfOption(option: ApiAutocompleteActorResponseElementsInner) {
    switch (option.type) {
      case "AutocompleteContact":
        return option.name ?? "AutocompleteContact";
      case "InspectionSampleUserReference":
        return option.name ?? "InspectionSampleUserReference";
    }
  }

  return (
    <Stack direction="column" spacing={2}>
      <SelectObjectField
        loading={query.isLoading}
        options={options}
        sx={{ flex: 1 }}
        getOptionLabel={(option) => option.label ?? ""}
        getOptionKey={(option) => option.value ?? ""}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onInputChange={(e, value) => setInputValue(value)}
        onValueChanged={props.onChange}
        {...props}
      />
      <Stack direction="row" spacing={2}>
        <ButtonLink
          underline="always"
          level="body-md"
          onClick={() => props.onSelfAssign()}
        >
          Mir zuweisen
        </ButtonLink>
        <ButtonLink
          underline="always"
          level="body-md"
          onClick={() => props.onFacilityAssign()}
        >
          Meine Facility zuweisen
        </ButtonLink>
      </Stack>
    </Stack>
  );
}
