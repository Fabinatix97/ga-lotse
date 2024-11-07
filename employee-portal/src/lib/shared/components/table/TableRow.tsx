/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { styled } from "@mui/joy";
import { Cell, Row, flexRender } from "@tanstack/react-table";
import { useContext } from "react";
import { isDefined } from "remeda";

import { TableNavigationContext } from "@/lib/shared/components/table/TableNavigationContext";

import { StyledCellProps, getRowCellStyles } from "./cellStyles";

const StyledRow = styled("tr")<{ subRow: boolean }>(({ theme, subRow }) => ({
  background: subRow ? theme.palette.background.level2 : undefined,
  "&:focus-visible": theme.focus.default,
  "&:has(.cellCanNavigate:hover)": {
    cursor: "pointer",
    backgroundColor: theme.palette.neutral.plainHoverBg,
  },
}));

const StyledCell = styled("td")<{ canNavigate: boolean } & StyledCellProps>(({
  theme,
  meta,
  canNavigate,
}) => {
  return {
    // higher specificity needed to override default style from Joy table
    ".MuiTable-root &": getRowCellStyles(meta, theme),
    "&:hover": canNavigate
      ? {
          cursor: "pointer",
          userSelect: "none",
        }
      : undefined,
  };
});

function isFocusColumn<TData>(
  cell: Cell<TData, unknown>,
  focusColumnAccessorKey: string | undefined,
) {
  // column id is sometimes different from the accessor key
  return (
    "accessorKey" in cell.column.columnDef &&
    focusColumnAccessorKey === cell.column.columnDef.accessorKey
  );
}

export function TableRow<TData>({
  row,
  rowNavigation,
}: Readonly<{
  row: Row<TData>;
  rowNavigation?: (cell: Row<TData>) => string | undefined;
}>) {
  const navContext = useContext(TableNavigationContext);
  const focusCell = row
    .getVisibleCells()
    .find((cell) => isFocusColumn(cell, navContext?.focusColumnAccessorKey));
  const rowLabel = focusCell ? getAriaLabel(focusCell) : undefined;
  const navRoute = rowNavigation?.(row);
  const isParentRow = row.depth === 0;

  function cellCanNavigate(cell: Cell<TData, unknown>) {
    const { meta } = cell.column.columnDef;
    return (
      isDefined(navRoute) &&
      ((isParentRow && meta?.canNavigate?.parentRow === true) ||
        (!isParentRow && meta?.canNavigate?.subRow === true))
    );
  }

  return (
    <StyledRow
      subRow={!isParentRow}
      tabIndex={isDefined(rowLabel) ? 0 : undefined}
      aria-label={rowLabel}
      data-targetroute={navRoute}
    >
      {row.getVisibleCells().map((cell) => {
        const canNavigate = cellCanNavigate(cell);

        function handleNavigate() {
          const route = navRoute;
          if (isDefined(route)) {
            navContext?.onCellClick?.(route);
          }
        }

        return (
          <StyledCell
            canNavigate={canNavigate}
            key={cell.id}
            meta={cell.column.columnDef.meta}
            className={canNavigate ? "cellCanNavigate" : undefined}
            onClick={canNavigate ? handleNavigate : undefined}
            onKeyDown={
              canNavigate
                ? (e) => {
                    if (e.code === "Enter") {
                      handleNavigate();
                    }
                  }
                : undefined
            }
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </StyledCell>
        );
      })}
    </StyledRow>
  );
}

function getAriaLabel<TData>(cell: Cell<TData, unknown>) {
  return `${String(cell.getValue())} (Klicken zum Navigieren)`;
}
