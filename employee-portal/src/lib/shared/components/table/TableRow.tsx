/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { styled } from "@mui/joy";
import { Cell, Row, flexRender } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { doNothing, isDefined } from "remeda";

import { RowNavigation } from "@/lib/shared/components/table/DataTable";

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

function getRowAriaLabel<TData>({ row, rowNavigation }: TableRowProps<TData>) {
  const focusCell = row
    .getVisibleCells()
    .find((cell) => isFocusColumn(cell, rowNavigation?.focusColumnAccessorKey));

  return isDefined(focusCell)
    ? `${String(focusCell.getValue())} (Klicken zum Navigieren)`
    : undefined;
}

function isParentRow<TData>(row: Row<TData>) {
  return row.depth === 0;
}

function canNavigate<TData>(row: Row<TData>, cell: Cell<TData, unknown>) {
  const { meta } = cell.column.columnDef;
  if (isParentRow(row)) {
    return meta?.canNavigate?.parentRow === true;
  }
  return meta?.canNavigate?.subRow === true;
}

function useRowNavigation<TData>({
  row,
  rowNavigation,
}: TableRowProps<TData>): {
  rowNavigationRoute: string | undefined;
  handleNavigate: () => void;
  cellCanNavigate: (cell: Cell<TData, unknown>) => boolean;
} {
  const router = useRouter();

  if (rowNavigation === undefined) {
    return {
      rowNavigationRoute: undefined,
      handleNavigate: doNothing,
      cellCanNavigate: () => false,
    };
  }

  if ("onClick" in rowNavigation) {
    const rowNavigationOnClick = rowNavigation.onClick(row);
    return {
      rowNavigationRoute: undefined,
      handleNavigate: () => {
        if (isDefined(rowNavigationOnClick)) {
          rowNavigationOnClick();
        }
      },
      cellCanNavigate: (cell) =>
        isDefined(rowNavigationOnClick) && canNavigate(row, cell),
    };
  }

  const rowNavigationRoute = rowNavigation.route(row);
  return {
    rowNavigationRoute: rowNavigationRoute,
    handleNavigate: () => {
      if (isDefined(rowNavigationRoute)) {
        router.push(rowNavigationRoute);
      }
    },
    cellCanNavigate: (cell) =>
      isDefined(rowNavigationRoute) && canNavigate(row, cell),
  };
}

interface TableRowProps<TData> {
  row: Row<TData>;
  rowNavigation?: RowNavigation<TData>;
  "data-testid"?: string;
}

export function TableRow<TData>({
  row,
  rowNavigation,
  ...props
}: TableRowProps<TData>) {
  const rowLabel = getRowAriaLabel({ row, rowNavigation });
  const { rowNavigationRoute, handleNavigate, cellCanNavigate } =
    useRowNavigation({
      row,
      rowNavigation,
    });

  return (
    <StyledRow
      data-testid={props["data-testid"]}
      subRow={!isParentRow(row)}
      tabIndex={isDefined(rowLabel) ? 0 : undefined}
      aria-label={rowLabel}
      data-targetroute={rowNavigationRoute}
      onKeyDown={(event) => {
        switch (event.key) {
          case "Enter": {
            handleNavigate();
            break;
          }
          case "ArrowDown": {
            event.preventDefault();
            const nextRow = event.currentTarget.nextElementSibling;
            if (nextRow instanceof HTMLElement) {
              nextRow.focus();
            }
            break;
          }
          case "ArrowUp": {
            event.preventDefault();
            const previousRow = event.currentTarget.previousElementSibling;
            if (previousRow instanceof HTMLElement) {
              previousRow.focus();
            }
            break;
          }
        }
      }}
    >
      {row
        .getVisibleCells()
        .filter((cell) => {
          return !(
            isParentRow(row) &&
            cell.column.columnDef.meta?.skipWhenParentRow === true
          );
        })
        .map((cell) => {
          const canNavigate = cellCanNavigate(cell);
          return (
            <StyledCell
              role={
                cell.column.columnDef.meta?.isRowHeader
                  ? "rowheader"
                  : undefined
              }
              colSpan={
                isParentRow(row) &&
                isDefined(cell.column.columnDef.meta?.spanWhenParentRow)
                  ? cell.column.columnDef.meta.spanWhenParentRow
                  : undefined
              }
              canNavigate={canNavigate}
              key={cell.id}
              meta={cell.column.columnDef.meta}
              className={canNavigate ? "cellCanNavigate" : undefined}
              onClick={canNavigate ? handleNavigate : undefined}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </StyledCell>
          );
        })}
    </StyledRow>
  );
}
