/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { FloatingLabelInput } from "@/lib/components/input/FloatingLabelInput";
import { useReplaceSearchParams } from "@/lib/hooks/useReplaceSearchParams";

interface SearchFilterProps {
  searchParamName: string;
  label: string;
}

export function SearchFilter({
  searchParamName,
  label,
}: Readonly<SearchFilterProps>) {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const onValueChange = useDebouncedCallback(
    (newValue: string) => {
      replaceSearchParams([
        {
          name: searchParamName,
          value: newValue?.length ? newValue : undefined,
        },
      ]);
    },
    250,
    {
      trailing: true,
    },
  );

  return (
    <FloatingLabelInput
      placeholder={label}
      type="search"
      startDecorator={<SearchIcon />}
      defaultValue={searchParams.get(searchParamName) ?? undefined}
      onChange={(event) => {
        onValueChange(event.target.value);
      }}
    />
  );
}
