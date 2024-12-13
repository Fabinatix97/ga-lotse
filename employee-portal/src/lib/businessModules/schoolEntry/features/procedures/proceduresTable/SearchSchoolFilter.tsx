/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SearchOutlined } from "@mui/icons-material";
import { Autocomplete } from "@mui/joy";
import { useState } from "react";
import { identity } from "remeda";

import { useSearchSchools } from "@/lib/baseModule/api/queries/contacts";
import { mapContactToSelectOption } from "@/lib/shared/helpers/contactCategoryMapper";

interface SearchSchoolFilterProps {
  schoolId: string | undefined;
  onChange: (schoolId: string | undefined) => void;
}

export function SearchSchoolFilter(props: SearchSchoolFilterProps) {
  const [schoolName, setSchoolName] = useState("");
  const searchSchools = useSearchSchools(schoolName);
  const schools = searchSchools.isSuccess ? searchSchools.data.elements : [];
  const schoolOptions = schools.map(mapContactToSelectOption);
  const selectedOption = schoolOptions.find(
    (schoolOption) => schoolOption.value === props.schoolId,
  );

  return (
    <Autocomplete
      value={selectedOption ?? null}
      inputValue={schoolName}
      options={schoolOptions}
      filterOptions={identity()}
      placeholder="Schule suchen"
      endDecorator={<SearchOutlined />}
      loading={searchSchools.isLoading}
      onInputChange={(_, newInputValue) => setSchoolName(newInputValue)}
      onChange={(_event, value) => {
        props.onChange(value?.value ?? undefined);
        setSchoolName("");
      }}
    />
  );
}
