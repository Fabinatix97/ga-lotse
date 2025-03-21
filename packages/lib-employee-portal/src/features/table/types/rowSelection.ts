/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Row,
  RowSelectionOptions,
  RowSelectionTableState,
} from "@tanstack/react-table";

import { ToggleSelectColumnProps } from "@/features/table/components/columns/ToggleSelectColumn";

export interface RowSelectionProps<TData>
  extends Pick<
    Required<RowSelectionOptions<TData>>,
    SupportedRowSelectionOptions
  > {
  state: RowSelectionTableState;
  getRowId: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  toggleSelectProps: ToggleSelectColumnProps;
}

type SupportedRowSelectionOptions =
  | "enableRowSelection"
  | "onRowSelectionChange";
