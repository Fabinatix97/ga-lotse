/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Table } from "@mui/joy";
import { Row, flexRender } from "@tanstack/react-table";
import { ReactNode } from "react";

import { EmptyCell } from "@/lib/components/table/cell/EmptyCell";
import { useTranslation } from "@/lib/i18n/client";

export function renderData<TData>(row: Row<TData>, id: string): ReactNode {
  const cell = row.getAllCells().find((c) => c.column.columnDef.id === id);
  return cell ? (
    <div key={id}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  ) : (
    <EmptyCell />
  );
}

export function renderDataRow<TData>(
  row: Row<TData>,
  id: string,
  title?: string,
) {
  return renderRow(renderData(row, id), title ?? id);
}

export function renderRow(data: ReactNode, title: string) {
  return (
    <SidebarRow key={title} title={title}>
      {data}
    </SidebarRow>
  );
}

export function SidebarTable({ children }: { children: ReactNode }) {
  return (
    <Sheet
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: (theme) => theme.spacing(2),
        borderRadius: (theme) => theme.radius.lg,
        backgroundColor: (theme) => theme.palette.background.level2,
        border: "1px solid",
        borderColor: "#CDD7E1",
      }}
    >
      <Table
        slotProps={{
          root: {
            sx: {
              width: "unset",
              "tr:not(:last-of-type)>th": {
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
              },
            },
          },
        }}
      >
        <tbody>{children}</tbody>
      </Table>
    </Sheet>
  );
}

function SidebarRow({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const { t } = useTranslation();
  return (
    <tr>
      {title && <th>{t(title)}</th>}
      <td>{children}</td>
    </tr>
  );
}
