/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactCategory } from "@eshg/base-api";
import { mapToSelectOption } from "@eshg/lib-employee-portal";
import { NullableFieldValue, SingleAutocompleteField } from "@eshg/lib-portal";

import { Institution } from "../../api/models/Institution";
import { useSearchInstitutionGroupsQuery } from "../../api/queries/groups";

interface SearchGroupFieldProps {
  name: string;
  label: string;
  institution: NullableFieldValue<Institution>;
  freeSolo?: boolean;
  disabled?: boolean;
}

function isSchool(institution: Institution | null): boolean {
  if (institution === null) {
    return false;
  }

  return institution.category === ApiContactCategory.School;
}

export function SearchGroupField(props: SearchGroupFieldProps) {
  const searchGroups = useSearchInstitutionGroupsQuery(
    props.institution?.id ?? "",
  );
  const groups = searchGroups.isSuccess ? searchGroups.data : [];
  const options = groups.map(mapToSelectOption);

  return (
    <SingleAutocompleteField
      name={props.name}
      label={props.label}
      required={
        isSchool(props.institution) ? "Bitte eine Gruppe angeben." : undefined
      }
      options={options}
      placeholder="Gruppe suchen"
      loading={searchGroups.isLoading}
      fetching={searchGroups.isFetching}
      freeSolo={props.freeSolo}
      disabled={props.disabled}
    />
  );
}
