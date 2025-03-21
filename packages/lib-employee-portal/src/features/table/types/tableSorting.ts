/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SortingState } from "@tanstack/react-table";

export type TableSortingProps =
  | ManualTableSortingProps
  | AutomaticTableSortingProps;

export interface ManualTableSortingProps {
  manualSorting: true;
  sortingState: SortingState;
  onSortingChange?: (state?: SortingState) => void;
}

export interface AutomaticTableSortingProps {
  manualSorting?: false;
  initialSorting?: SortingState;
}
