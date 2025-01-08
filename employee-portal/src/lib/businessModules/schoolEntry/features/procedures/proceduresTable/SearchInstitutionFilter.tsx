/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SearchOutlined } from "@mui/icons-material";
import { Autocomplete } from "@mui/joy";
import { useState } from "react";
import { identity } from "remeda";

import { useSearchSchoolOrDaycare } from "@/lib/baseModule/api/queries/contacts";
import { mapContactToSelectOption } from "@/lib/shared/helpers/contactCategoryMapper";

interface SearchInstitutionFilterProps {
  institutionId: string | undefined;
  onChange: (institutionId: string | undefined) => void;
}

export function SearchInstitutionFilter(props: SearchInstitutionFilterProps) {
  const [institutionName, setInstitutionName] = useState("");
  const searchInstitutions = useSearchSchoolOrDaycare(institutionName);
  const institutions = searchInstitutions.isSuccess
    ? searchInstitutions.data.elements
    : [];
  const institutionOptions = institutions.map(mapContactToSelectOption);
  const selectedOption = institutionOptions.find(
    (institutionOption) => institutionOption.value === props.institutionId,
  );

  return (
    <Autocomplete
      value={selectedOption ?? null}
      inputValue={institutionName}
      options={institutionOptions}
      filterOptions={identity()}
      placeholder="Schule suchen"
      endDecorator={<SearchOutlined />}
      loading={searchInstitutions.isLoading}
      onInputChange={(_, newInputValue) => setInstitutionName(newInputValue)}
      onChange={(_event, value) => {
        props.onChange(value?.value ?? undefined);
        setInstitutionName("");
      }}
    />
  );
}
