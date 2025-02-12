/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Autocomplete } from "@mui/joy";
import { useState } from "react";
import { identity } from "remeda";

import {
  useGetOptionalContact,
  useSearchSchoolOrDaycare,
} from "@/lib/baseModule/api/queries/contacts";
import { mapContactToSelectOption } from "@/lib/shared/helpers/selectOptionMapper";

interface SearchInstitutionFilterProps {
  institutionId: string | undefined;
  onChange: (institutionId: string | undefined) => void;
  placeholder: string;
}

export function SearchInstitutionFilter(props: SearchInstitutionFilterProps) {
  const [institutionName, setInstitutionName] = useState("");
  const searchInstitutions = useSearchSchoolOrDaycare(institutionName);
  const institutions = searchInstitutions.isSuccess
    ? searchInstitutions.data.elements
    : [];
  const { data } = useGetOptionalContact(props.institutionId);
  const selectedInstitution =
    data !== undefined ? mapContactToSelectOption(data) : undefined;
  const institutionOptions = institutions.map(mapContactToSelectOption);
  const selectedOption =
    selectedInstitution ??
    institutionOptions.find(
      (institutionOption) => institutionOption.value === props.institutionId,
    );

  return (
    <Autocomplete
      value={selectedOption ?? null}
      inputValue={institutionName}
      options={institutionOptions}
      filterOptions={identity()}
      placeholder={props.placeholder}
      loading={searchInstitutions.isLoading}
      onInputChange={(_, newInputValue) => setInstitutionName(newInputValue)}
      onChange={(_event, value) => {
        props.onChange(value?.value ?? undefined);
        setInstitutionName("");
      }}
    />
  );
}
