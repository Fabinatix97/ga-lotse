/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { FilterListOff, FilterListOutlined } from "@mui/icons-material";

import {
  ToggleExpandButton,
  ToggleExpandButtonProps,
} from "../../../../components/buttons/ToggleExpandButton";

export interface ToggleFilterButtonProps extends Omit<
  ToggleExpandButtonProps,
  "expanded"
> {
  isFilterVisible?: boolean;
  activeFilters?: number;
  autoFocus?: boolean;
}

export function ToggleFilterButton(props: ToggleFilterButtonProps) {
  const { activeFilters = 0, isFilterVisible = false, ...buttonProps } = props;

  return (
    <ToggleExpandButton
      expanded={isFilterVisible}
      startDecorator={
        isFilterVisible ? <FilterListOff /> : <FilterListOutlined />
      }
      activeStateText={activeFilters > 0 ? activeFilters : undefined}
      {...buttonProps}
    >
      Filter
    </ToggleExpandButton>
  );
}
