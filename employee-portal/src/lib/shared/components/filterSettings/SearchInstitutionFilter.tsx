/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSearchSchoolOrDaycareContactQuery } from "@eshg/dental";
import {
  mapContactToSelectOption,
  useGetOptionalContactQuery,
} from "@eshg/lib-employee-portal";
import { CustomAutocomplete } from "@eshg/lib-portal/components/inputs/CustomAutocomplete";
import { useState } from "react";
import { identity } from "remeda";

interface SearchInstitutionFilterProps {
  institutionId: string | undefined;
  onChange: (institutionId: string | undefined) => void;
  placeholder: string;
}

export function SearchInstitutionFilter(props: SearchInstitutionFilterProps) {
  const [institutionName, setInstitutionName] = useState("");
  const searchInstitutions =
    useSearchSchoolOrDaycareContactQuery(institutionName);
  const institutions = searchInstitutions.isSuccess
    ? searchInstitutions.data.elements
    : [];
  const { data } = useGetOptionalContactQuery(props.institutionId);
  const selectedInstitution =
    data !== undefined ? mapContactToSelectOption(data) : undefined;
  const institutionOptions = institutions.map(mapContactToSelectOption);
  const selectedOption =
    selectedInstitution ??
    institutionOptions.find(
      (institutionOption) => institutionOption.value === props.institutionId,
    );

  return (
    <CustomAutocomplete
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
