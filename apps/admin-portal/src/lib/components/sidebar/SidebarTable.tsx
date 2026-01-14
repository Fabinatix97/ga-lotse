/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Table } from "@mui/joy";
import { PropsWithChildren, ReactNode } from "react";
import { isNullish } from "remeda";

import { SidebarCellInfo } from "@/lib/components/sidebar/SidebarDetails";
import { EmptyCell } from "@/lib/components/table/cell/common/EmptyCell";
import { Actor, OrgUnit, Rule } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

export function SidebarData<TData extends OrgUnit | Actor | Rule>({
  entity,
  cell,
  editable,
}: {
  entity: TData;
  cell: SidebarCellInfo<TData>;
  editable: boolean;
}): ReactNode {
  if (!editable && isValueNullish(cell.id, entity.entity))
    return <EmptyCell key={cell.id} />;

  return (
    <cell.cell
      key={cell.id}
      id={cell.id}
      entity={entity}
      optional={cell.optional}
      options={cell.options}
      editable={editable}
    />
  );
}

export function SidebarRow({
  title,
  labelId,
  children,
}: Readonly<PropsWithChildren<{ title: string; labelId?: string }>>) {
  const { t } = useTranslation();
  return (
    <tr>
      <th id={labelId}>{t(title)}</th>
      <td>{children}</td>
    </tr>
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

function isValueNullish(id: string, entity?: Record<string, unknown>): boolean {
  if (!entity) return true;
  if (!(id in entity)) return true;
  return isNullish(entity[id]);
}
