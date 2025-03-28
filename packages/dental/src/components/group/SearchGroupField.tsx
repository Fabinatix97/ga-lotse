/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapToSelectOption } from "@eshg/lib-employee-portal";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { CircularProgress } from "@mui/joy";

import { useSearchInstitutionGroupsQuery } from "@/api/queries/groups";

interface SearchGroupFieldProps {
  name: string;
  label: string;
  institutionId: string;
  freeSolo?: boolean;
  disabled?: boolean;
}

export function SearchGroupField(props: SearchGroupFieldProps) {
  const searchGroups = useSearchInstitutionGroupsQuery(props.institutionId);
  const groups = searchGroups.isSuccess ? searchGroups.data : [];
  const options = groups.map(mapToSelectOption);

  return (
    <SingleAutocompleteField
      name={props.name}
      label={props.label}
      required="Bitte eine Gruppe angeben."
      options={options}
      placeholder="Gruppe suchen"
      loading={searchGroups.isFetching}
      endDecorator={
        searchGroups.isLoading ? <CircularProgress size="sm" /> : null
      }
      freeSolo={props.freeSolo}
      disabled={props.disabled}
    />
  );
}
