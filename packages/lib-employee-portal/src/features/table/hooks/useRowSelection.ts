/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RowSelectionState, Updater } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { mapToObj, pickBy } from "remeda";

import { ToggleSelectColumnProps } from "../components/columns/ToggleSelectColumn";
import { RowSelectionProps } from "../types/rowSelection";

interface UseRowSelectionOptions {
  initialRowSelection?: RowSelectionState;
  toggleSelectProps?: ToggleSelectColumnProps;
}

interface UseRowSelectionResult<TData> {
  rowSelection: RowSelectionState;
  rowSelectionProps: RowSelectionProps<TData>;
}

export function useRowSelection<TData extends UniqueEntity>(
  options: UseRowSelectionOptions = {},
): UseRowSelectionResult<TData> {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    options.initialRowSelection ?? {},
  );

  const onRowSelectionChange = useCallback(
    (updaterOrValue: Updater<RowSelectionState>) =>
      setRowSelection((prevRowSelection) =>
        typeof updaterOrValue === "function"
          ? updaterOrValue(prevRowSelection)
          : updaterOrValue,
      ),
    [setRowSelection],
  );

  return {
    rowSelection,
    rowSelectionProps: {
      enableRowSelection: true,
      state: { rowSelection },
      getRowId: getUniqueEntityId,
      onRowSelectionChange,
      toggleSelectProps: options.toggleSelectProps ?? {},
    },
  };
}

export function useSyncRowSelection<TData extends UniqueEntity>(
  rowSelectionProps: RowSelectionProps<TData>,
  rows: readonly TData[],
) {
  const { onRowSelectionChange } = rowSelectionProps;
  useEffect(() => {
    onRowSelectionChange((prevRowSelection) =>
      deselectMissingRows(prevRowSelection, rows),
    );
  }, [rows, onRowSelectionChange]);
}

interface UniqueEntity {
  id: string;
}

function getUniqueEntityId(entity: UniqueEntity) {
  return entity.id;
}

export function mapRowIdsToRowSelection(rowIds: string[]): RowSelectionState {
  return mapToObj(rowIds, (rowId) => [rowId, true]);
}

export function mapRowSelectionToRowIds(
  rowSelectionState: RowSelectionState,
): string[] {
  return Object.keys(rowSelectionState).filter(
    (rowId) => rowSelectionState[rowId] === true,
  );
}

export function deselectMissingRows<TData extends UniqueEntity>(
  rowSelection: RowSelectionState,
  rows: readonly TData[],
): RowSelectionState {
  const availableRowIds = createSetFromRowIds(rows);
  return pickBy(
    rowSelection,
    (isSelected, rowId) => isSelected && availableRowIds.has(rowId),
  );
}

function createSetFromRowIds<TData extends UniqueEntity>(
  rows: readonly TData[],
) {
  return new Set(rows.map(getUniqueEntityId));
}
