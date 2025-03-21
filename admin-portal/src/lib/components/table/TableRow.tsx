/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, styled } from "@mui/joy";
import { Row, Table, flexRender } from "@tanstack/react-table";
import { PropsWithChildren, createElement, useRef } from "react";
import { isFunction } from "remeda";

import { CellStyle } from "@/lib/components/table/Table";
import { OverridableEntity } from "@/lib/helpers/entities";

const StyledRow = styled("tr")<{ $subRow: boolean }>(({ theme, $subRow }) => ({
  color: $subRow ? theme.palette.warning.plainColor + "!important" : undefined,
}));

const StyledCell = styled("td")<{ $cellStyle?: CellStyle }>(({
  theme,
  $cellStyle,
}) => {
  return {
    ".MuiTable-root>&": {
      paddingTop: $cellStyle === "button" ? theme.spacing(0.5) : undefined,
      paddingBottom: $cellStyle === "button" ? theme.spacing(0.5) : undefined,
    },
  };
});

const SBox = styled(Box)(() => ({
  border: "solid 1px transparent",
  borderRadius: "var(--joy-radius-sm)",
  margin:
    "calc(-1 * var(--TableCell-paddingY)) calc(-1 * var(--TableCell-paddingX))",
  padding:
    "calc(var(--TableCell-paddingY) - 1px) calc(var(--TableCell-paddingX) - 1px)",
}));

export type OverridableTableRowProps<TData> = Readonly<{
  table: Table<TData>;
  row: Row<TData>;
  onClick: () => void;
}>;

export function OverridableTableRow<TData extends OverridableEntity<TData>>(
  props: OverridableTableRowProps<TData>,
) {
  const { table, row, onClick } = props;
  if (row.original._override) {
    return (
      <StyledRow $subRow={row.depth > 0}>
        <td colSpan={row.getVisibleCells().length}>
          {isFunction(row.original._override)
            ? createElement(row.original._override, {
                table,
                row,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick: () => {},
              })
            : row.original._override}
        </td>
      </StyledRow>
    );
  }
  return <TableRow row={row} onClick={onClick} />;
}

export function TableRow<TData>({
  row,
  onClick,
}: Readonly<{ row: Row<TData>; onClick?: () => void }>) {
  return (
    <StyledRow
      $subRow={row.depth > 0}
      onClick={() => {
        onClick?.();
      }}
    >
      {row.getVisibleCells().map((cell) => {
        const cellStyle = cell.column.columnDef.meta?.cellStyle;
        const rendered = flexRender(
          cell.column.columnDef.cell,
          cell.getContext(),
        );

        return (
          <StyledCell key={cell.id} $cellStyle={cellStyle}>
            {cellStyle === "button" ? (
              rendered
            ) : (
              <CellContainer>{rendered}</CellContainer>
            )}
          </StyledCell>
        );
      })}
    </StyledRow>
  );
}

function CellContainer({ children }: Readonly<PropsWithChildren>) {
  const ref = useRef<HTMLSpanElement>(null);
  return <SBox ref={ref}>{children}</SBox>;
}
