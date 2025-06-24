/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { identity } from "remeda";

import { ApiContactCategory } from "@eshg/base-api";
import { CustomAutocomplete } from "@eshg/lib-portal";

import { getEntityId, isSameEntity } from "../../../../api/models/BaseEntity";
import { Contact } from "../../../contacts/api/models/Contact";
import {
  useGetOptionalContactQuery,
  useSearchContacts,
} from "../../../contacts/api/queries";

interface SearchInstitutionFilterProps {
  institutionId: string | undefined;
  categories: Set<ApiContactCategory>;
  onChange: (institutionId: string | undefined) => void;
  placeholder: string;
}

export function SearchInstitutionFilter(props: SearchInstitutionFilterProps) {
  const [institutionName, setInstitutionName] = useState("");
  const { data: institutionSearchResult, isFetching } = useSearchContacts(
    institutionName,
    props.categories,
  );
  const matchedInstitutions = institutionSearchResult?.elements ?? [];
  const { data: selectedInstitution } = useGetOptionalContactQuery(
    props.institutionId,
  );
  const selectedOption =
    selectedInstitution ??
    matchedInstitutions.find(
      (institution) => institution.id === props.institutionId,
    );

  return (
    <CustomAutocomplete
      value={selectedOption ?? null}
      inputValue={institutionName}
      options={matchedInstitutions}
      filterOptions={identity()}
      placeholder={props.placeholder}
      loading={isFetching}
      getOptionKey={getEntityId}
      getOptionLabel={getInstitutionName}
      isOptionEqualToValue={isSameEntity}
      onInputChange={(_, newInputValue) => setInstitutionName(newInputValue)}
      onChange={(_event, value) =>
        props.onChange(value !== null ? getEntityId(value) : undefined)
      }
    />
  );
}

function getInstitutionName(institution: Contact): string {
  return institution.name;
}
