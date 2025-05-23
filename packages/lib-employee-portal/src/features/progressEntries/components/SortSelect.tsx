/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Select } from "@mui/joy";
import { isDefined } from "remeda";

import { SelectOptions, buildEnumOptions } from "@eshg/lib-portal";
import { ApiProgressEntrySortOrder } from "@eshg/lib-procedures-api";

import { useReplaceSearchParams } from "../../../hooks/useReplaceSearchParams";
import { ProgressEntriesSearchParams } from "../types/common";

interface SortSelectProps {
  searchParams: ProgressEntriesSearchParams;
  "aria-label"?: string;
}

const sortOrderNames = {
  [ApiProgressEntrySortOrder.Asc]: "Älteste zuerst",
  [ApiProgressEntrySortOrder.Desc]: "Neueste zuerst",
} satisfies Record<ApiProgressEntrySortOrder, string>;

export function SortSelect(props: SortSelectProps) {
  const replaceSearchParams = useReplaceSearchParams();

  const sortOrderParam = props.searchParams.sortOrder;
  const ariaLabel = props["aria-label"];

  return (
    <Select
      size="sm"
      sx={{ width: "220px" }}
      placeholder={sortOrderNames[ApiProgressEntrySortOrder.Desc]}
      defaultValue={
        isDefined(sortOrderParam)
          ? sortOrderParam
          : ApiProgressEntrySortOrder.Desc
      }
      color="primary"
      slotProps={{
        button: {
          "aria-label": ariaLabel,
        },
      }}
      onChange={(_, value) => {
        if (value !== null) {
          replaceSearchParams([{ name: "sortOrder", value: value }]);
        }
      }}
    >
      <SelectOptions options={buildEnumOptions(sortOrderNames)} />
    </Select>
  );
}
