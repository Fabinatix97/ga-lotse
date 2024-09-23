/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProgressEntrySortOrder } from "@eshg/employee-portal-api/businessProcedures";
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { Select } from "@mui/joy";
import { isDefined } from "remeda";

import { useReplaceSearchParams } from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";

import { ProgressEntriesSearchParams } from "./types";

interface SortSelectProps {
  searchParams: ProgressEntriesSearchParams;
  "aria-label"?: string;
}

export const sortOrderNames = {
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
      onChange={(_, value) => {
        if (value !== null) {
          replaceSearchParams([{ name: "sortOrder", value: value }]);
        }
      }}
      slotProps={{
        button: {
          "aria-label": ariaLabel,
        },
      }}
    >
      <SelectOptions options={buildEnumOptions(sortOrderNames)}></SelectOptions>
    </Select>
  );
}
