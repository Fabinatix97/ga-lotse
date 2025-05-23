/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { styled } from "@mui/joy";
import { Cell, Row, flexRender } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { doNothing, isDefined } from "remeda";

import { InternalLink } from "@eshg/lib-portal";

import { RowNavigation } from "../../types/rowNavigation";
import { DataCell } from "../cells/DataCell";

const StyledRow = styled("tr")<{ subRow: boolean }>(({ theme, subRow }) => ({
  background: subRow ? theme.palette.background.level2 : undefined,
  position: "relative",
  "&:focus-visible": {
    ...theme.focus.default,
    outlineOffset: "-2px",
  },
  "&:has(.cellCanNavigate:hover)": {
    cursor: "pointer",
    backgroundColor: theme.palette.neutral.plainHoverBg,
  },
}));

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

function isRowFocusable<TData>({ row, rowNavigation }: TableRowProps<TData>) {
  return row
    .getVisibleCells()
    .some((cell) => isFocusColumn(cell, rowNavigation?.focusColumnAccessorKey));
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
  cellIsLink: (cell: Cell<TData, unknown>) => boolean;
} {
  const router = useRouter();

  if (rowNavigation === undefined) {
    return {
      rowNavigationRoute: undefined,
      handleNavigate: doNothing,
      cellCanNavigate: () => false,
      cellIsLink: () => false,
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
      cellIsLink: () => false,
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
    cellIsLink: (cell) =>
      isDefined(rowNavigationRoute) &&
      canNavigate(row, cell) &&
      isFocusColumn(cell, rowNavigation?.focusColumnAccessorKey),
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
  const { rowNavigationRoute, handleNavigate, cellCanNavigate, cellIsLink } =
    useRowNavigation({
      row,
      rowNavigation,
    });
  const tabIndex = isRowFocusable({ row, rowNavigation }) ? 0 : undefined;

  return (
    <StyledRow
      data-testid={props["data-testid"]}
      subRow={!isParentRow(row)}
      tabIndex={tabIndex}
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
          const cellFlexRenderer = flexRender(
            cell.column.columnDef.cell,
            cell.getContext(),
          );
          const isLink = cellIsLink(cell);
          const isRowHeader =
            cell.column.columnDef.meta?.isRowHeader ??
            isFocusColumn(cell, rowNavigation?.focusColumnAccessorKey);
          const isClickableElement =
            canNavigate === false &&
            isDefined(rowNavigation?.focusColumnAccessorKey);

          return (
            <DataCell
              key={cell.id}
              role={isRowHeader ? "rowheader" : undefined}
              colSpan={
                isParentRow(row) &&
                isDefined(cell.column.columnDef.meta?.spanWhenParentRow)
                  ? cell.column.columnDef.meta.spanWhenParentRow
                  : undefined
              }
              canNavigate={canNavigate}
              isClickableElement={isClickableElement}
              meta={cell.column.columnDef.meta}
              className={canNavigate ? "cellCanNavigate" : undefined}
              onClick={canNavigate ? handleNavigate : undefined}
              onKeyDown={(event) => {
                switch (event.key) {
                  case "Enter":
                  case "ArrowDown":
                  case "ArrowUp": {
                    if (isClickableElement) {
                      event.stopPropagation();
                    }
                  }
                }
              }}
            >
              {isLink ? (
                <InternalLink
                  sx={{
                    color: "unset",
                    "&:hover": {
                      textDecorationLine: "none",
                    },
                  }}
                  href={rowNavigationRoute!}
                >
                  {cellFlexRenderer}
                </InternalLink>
              ) : (
                cellFlexRenderer
              )}
            </DataCell>
          );
        })}
    </StyledRow>
  );
}
