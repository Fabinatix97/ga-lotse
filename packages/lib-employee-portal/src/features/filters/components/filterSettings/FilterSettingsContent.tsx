/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider, Stack } from "@mui/joy";
import { ReactNode } from "react";
import { isNonNullish } from "remeda";

import { RequiresChildren } from "@eshg/lib-portal";

export interface FilterSettingsContentProps extends RequiresChildren {
  showActiveFilters?: boolean;
  activeFilters?: ReactNode;
  filterTemplateSelect?: ReactNode;
}

export function FilterSettingsContent(props: FilterSettingsContentProps) {
  return (
    <Stack sx={{ gap: 3 }} data-testid="filter-settings">
      {props.filterTemplateSelect}
      {props.showActiveFilters && props.activeFilters}
      {(isNonNullish(props.filterTemplateSelect) ||
        props.showActiveFilters) && <Divider />}

      <Stack data-testid="filterSettingContent" sx={{ flex: 1, gap: 2 }}>
        {props.children}
      </Stack>
    </Stack>
  );
}
