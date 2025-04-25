/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { identity } from "remeda";

import { ApiContactCategory } from "@eshg/base-api";
import { CustomAutocomplete } from "@eshg/lib-portal/components/inputs/CustomAutocomplete";

import {
  useGetOptionalContactQuery,
  useSearchContacts,
} from "@/features/contacts/api/queries";
import { mapContactToSelectOption } from "@/features/contacts/utils/mappers";

interface SearchInstitutionFilterProps {
  institutionId: string | undefined;
  categories: Set<ApiContactCategory>;
  onChange: (institutionId: string | undefined) => void;
  placeholder: string;
}

export function SearchInstitutionFilter(props: SearchInstitutionFilterProps) {
  const [institutionName, setInstitutionName] = useState("");
  const searchInstitutions = useSearchContacts(
    institutionName,
    props.categories,
  );
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
      loading={searchInstitutions.isFetching}
      onInputChange={(_, newInputValue) => setInstitutionName(newInputValue)}
      onChange={(_event, value) => {
        props.onChange(value?.value ?? undefined);
        setInstitutionName("");
      }}
    />
  );
}
