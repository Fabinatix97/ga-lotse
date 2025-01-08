/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DisplayColumnDef, TableOptions } from "@tanstack/react-table";

import { ToggleExpandColumn } from "./ToggleExpandColumn";
import { ToggleSelectColumn } from "./ToggleSelectColumn";

interface TableFeatures {
  toggleExpand: boolean;
  toggleSelect: boolean;
}

export function addFeatureColumns<TData>(
  columns: TableOptions<TData>["columns"],
  features: TableFeatures,
): TableOptions<TData>["columns"] {
  if (features.toggleSelect) {
    columns = [ToggleSelectColumn as DisplayColumnDef<TData>, ...columns];
  }
  if (features.toggleExpand) {
    columns = [ToggleExpandColumn as DisplayColumnDef<TData>, ...columns];
  }

  return columns;
}
