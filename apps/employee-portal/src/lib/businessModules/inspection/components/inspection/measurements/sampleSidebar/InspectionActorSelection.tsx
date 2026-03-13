/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, createFilterOptions } from "@mui/joy";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { ApiAutocompleteActorResponseElementsInner } from "@eshg/inspection-api";
import {
  ButtonLink,
  SelectObjectField,
  SelectObjectFieldValue,
} from "@eshg/lib-portal";

import { useAutocompleteUserFacilityContactQuery } from "@/lib/businessModules/inspection/api/queries/autocomplete";

interface InspectionActorSelectionOption {
  label: string;
  value: { id: string; type: string };
}

interface InspectionActorSelectionProps {
  useLaboratories: boolean;
  onSelfAssign: () => void;
  onFacilityAssign?: () => void;
  name: string;
  label: string;
  required?: string;
  placeholder?: string;
  onChange?: (
    value: SelectObjectFieldValue<InspectionActorSelectionOption, false>,
  ) => void;
}

export function InspectionActorSelection(props: InspectionActorSelectionProps) {
  const [inputValue, setInputValue] = useState("");
  const [parameterQuery] = useDebounce(inputValue, 100);
  const [options, setOptions] = useState<
    {
      label: string;
      value: {
        id: string;
        type: "AutocompleteContact" | "InspectionSampleUserReference";
      };
    }[]
  >([]);

  const query = useAutocompleteUserFacilityContactQuery({
    prefix: parameterQuery,
    useLaboratories: props.useLaboratories,
  });

  useEffect(() => {
    if (!query.isSuccess) return;
    setOptions(
      query.data.elements.map((element) => ({
        label: getLabelOfOption(element),
        value: { id: getValueOfOption(element), type: element.type },
      })),
    );
  }, [query.isSuccess, query.data]);

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

  function getGroupOfOption(option: InspectionActorSelectionOption) {
    switch (option.value.type) {
      case "AutocompleteContact":
        return "Facility";
      case "InspectionSampleUserReference":
        return "User";
      default:
        return "Else";
    }
  }

  return (
    <Stack direction="column" spacing={2}>
      <SelectObjectField
        filterOptions={createFilterOptions({ matchFrom: "start" })}
        loading={query.isLoading}
        options={options.sort(
          (a, b) => -b.value.type.localeCompare(a.value.type),
        )}
        sx={{ flex: 1 }}
        groupBy={(option: InspectionActorSelectionOption) =>
          getGroupOfOption(option)
        }
        getOptionLabel={(option) => option.label ?? ""}
        getOptionKey={(option) => option.value.id ?? ""}
        isOptionEqualToValue={(option, value) =>
          option.value.id === value.value.id
        }
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
        {props.onFacilityAssign && (
          <ButtonLink
            underline="always"
            level="body-md"
            onClick={props.onFacilityAssign}
          >
            Meine Einrichtung zuweisen
          </ButtonLink>
        )}
      </Stack>
    </Stack>
  );
}
