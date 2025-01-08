/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { SearchOutlined } from "@mui/icons-material";

import { useSearchInstitutionGroups } from "@/lib/businessModules/dental/api/queries/childApi";

interface SearchGroupFieldProps {
  name: string;
  label: string;
  institutionId: string;
  freeSolo?: boolean;
}

function mapGroupToSelectOption(group: string): SelectOption {
  return {
    label: group,
    value: group,
  };
}

export function SearchGroupField(props: SearchGroupFieldProps) {
  const searchGroups = useSearchInstitutionGroups(props.institutionId);
  const groups = searchGroups.isSuccess ? searchGroups.data : [];
  const options = groups.map(mapGroupToSelectOption);

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
