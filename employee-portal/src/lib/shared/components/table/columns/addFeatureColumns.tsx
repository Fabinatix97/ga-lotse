/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DisplayColumnDef, TableOptions } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { ToggleExpandColumn } from "./ToggleExpandColumn";
import {
  ToggleSelectColumn,
  ToggleSelectColumnProps,
} from "./ToggleSelectColumn";

interface TableFeatures {
  toggleExpand: boolean;
  toggleSelectProps?: ToggleSelectColumnProps;
}

export function addFeatureColumns<TData>(
  columns: TableOptions<TData>["columns"],
  features: TableFeatures,
): TableOptions<TData>["columns"] {
  if (isDefined(features.toggleSelectProps)) {
    columns = [
      ToggleSelectColumn(features.toggleSelectProps) as DisplayColumnDef<TData>,
      ...columns,
    ];
  }
  if (features.toggleExpand) {
    columns = [ToggleExpandColumn as DisplayColumnDef<TData>, ...columns];
  }

  return columns;
}
