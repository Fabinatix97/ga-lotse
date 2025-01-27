/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchInstitutionGroups } from "@eshg/dental/api/queries/childApi";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { SearchOutlined } from "@mui/icons-material";

import { mapToSelectOption } from "@/lib/shared/helpers/selectOptionMapper";

interface SearchGroupFieldProps {
  name: string;
  label: string;
  institutionId: string;
  freeSolo?: boolean;
}

export function SearchGroupField(props: SearchGroupFieldProps) {
  const searchGroups = useSearchInstitutionGroups(props.institutionId);
  const groups = searchGroups.isSuccess ? searchGroups.data : [];
  const options = groups.map(mapToSelectOption);

  return (
    <SingleAutocompleteField
      name={props.name}
      label={props.label}
      required="Bitte eine Gruppe angeben."
      options={options}
      placeholder="Gruppe suchen"
      endDecorator={<SearchOutlined />}
      loading={searchGroups.isLoading}
      freeSolo={props.freeSolo}
    />
  );
}
