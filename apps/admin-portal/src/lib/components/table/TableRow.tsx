/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, styled } from "@mui/joy";
import { Row, flexRender } from "@tanstack/react-table";
import { PropsWithChildren, useRef } from "react";

import { ApiAdminStagedEntityType } from "@eshg/service-directory-api";

import { DeleteRow } from "@/lib/components/table/DeleteRow";
import { NewEntityParentRow } from "@/lib/components/table/NewEntityParentRow";
import { CellStyle } from "@/lib/components/table/Table";
import {
  EntityWrapper,
  NEW_ENTITY_PARENT_ID,
  isStagedEntity,
} from "@/lib/hooks/useEntities";

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
  row: Row<TData>;
  onClick: () => void;
}>;

export function OverridableTableRow<TData extends EntityWrapper>(
  props: OverridableTableRowProps<TData>,
) {
  return (
    <StyledRow $subRow={props.row.depth > 0} onClick={props.onClick}>
      <InnerOverridableTableRow {...props} />
    </StyledRow>
  );
}

function InnerOverridableTableRow<TData extends EntityWrapper>({
  row,
}: Pick<OverridableTableRowProps<TData>, "row">) {
  if (row.original.id === NEW_ENTITY_PARENT_ID) {
    return (
      <td colSpan={row.getVisibleCells().length}>
        <NewEntityParentRow row={row} />
      </td>
    );
  }
  if (
    isStagedEntity(row.original) &&
    row.original.stagedEntityType === ApiAdminStagedEntityType.Del
  ) {
    return (
      <td colSpan={row.getVisibleCells().length}>
        <DeleteRow row={row} />
      </td>
    );
  }
  return <InnerTableRow row={row} />;
}

export function TableRow<TData>({
  row,
}: Pick<OverridableTableRowProps<TData>, "row">) {
  return (
    <StyledRow $subRow={row.depth > 0}>
      <InnerTableRow row={row} />
    </StyledRow>
  );
}

function InnerTableRow<TData>({
  row,
}: Pick<OverridableTableRowProps<TData>, "row">) {
  return (
    <>
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
    </>
  );
}

function CellContainer({ children }: Readonly<PropsWithChildren>) {
  const ref = useRef<HTMLSpanElement>(null);
  return <SBox ref={ref}>{children}</SBox>;
}
