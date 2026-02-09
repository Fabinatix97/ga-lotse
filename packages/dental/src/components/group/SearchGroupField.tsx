/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapToSelectOption } from "@eshg/lib-employee-portal";
import { NullableFieldValue, SingleAutocompleteField } from "@eshg/lib-portal";

import { Institution } from "../../api/models/Institution";
import { useSearchInstitutionGroupsQuery } from "../../api/queries/groups";

interface SearchGroupFieldProps {
  name: string;
  label: string;
  institution: NullableFieldValue<Institution>;
  openGroupsOnly?: boolean;
  schoolYear?: number;
  freeSolo?: boolean;
  disabled?: boolean;
}

export function SearchGroupField(props: SearchGroupFieldProps) {
  const searchGroups = useSearchInstitutionGroupsQuery(
    props.institution?.id ?? "",
    props.openGroupsOnly ?? false,
    props.schoolYear,
  );
  const groups = searchGroups.isSuccess ? searchGroups.data : [];
  const options = groups.map(mapToSelectOption);

  return (
    <SingleAutocompleteField
      name={props.name}
      label={props.label}
      options={options}
      placeholder="Gruppe suchen"
      loading={searchGroups.isLoading}
      fetching={searchGroups.isFetching}
      freeSolo={props.freeSolo}
      disabled={props.disabled}
    />
  );
}
