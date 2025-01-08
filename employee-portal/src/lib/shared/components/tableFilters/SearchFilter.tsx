/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import SearchIcon from "@mui/icons-material/Search";
import { Input } from "@mui/joy";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { UseTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

interface SearchFilterProps {
  tableControl: UseTableControl;
  searchParamName: string;
  label: string;
  relevanceSortFieldName?: string;
}

export function SearchFilter({
  tableControl,
  searchParamName,
  label,
  relevanceSortFieldName,
}: SearchFilterProps) {
  const searchParams = useSearchParams();

  const onValueChange = useDebouncedCallback(
    (newValue: string) => {
      tableControl.setSearchRequest({
        value: newValue,
        searchParamName,
        relevanceSortFieldName,
      });
    },
    250,
    {
      trailing: true,
    },
  );

  return (
    <Input
      variant="outlined"
      placeholder={label}
      aria-label={label}
      type="search"
      startDecorator={<SearchIcon />}
      defaultValue={searchParams.get(searchParamName) ?? undefined}
      onChange={(event) => {
        onValueChange(event.target.value);
      }}
      slotProps={{
        input: {
          role: "searchbox",
        },
      }}
    />
  );
}
