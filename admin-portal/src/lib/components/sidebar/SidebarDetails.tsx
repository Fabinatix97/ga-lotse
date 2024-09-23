/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@tanstack/react-table";

import { SidebarHeader } from "@/lib/components/sidebar/SidebarHeader";
import {
  SidebarTable,
  renderData,
  renderDataRow,
  renderRow,
} from "@/lib/components/sidebar/SidebarTable";
import { EDIT_BUTTON_ID } from "@/lib/components/table/addEditColumns";
import { TableContextProvider } from "@/lib/components/table/context/TableEditContext";
import { getAdminName } from "@/lib/helpers/adminName";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";

export function SidebarDetails<TData extends UniqueEntity & EditableEntity>({
  row,
  headerIds,
  rowIds,
  idOrAuthor,
}: Readonly<{
  row: Row<TData>;
  headerIds: string[];
  rowIds: string[];
  idOrAuthor?: boolean;
}>) {
  const editRow = row.subRows.find((r) => r.original.author === getAdminName());
  const rowToDisplay = editRow ?? row;

  return (
    <TableContextProvider editable={true}>
      <SidebarHeader editButton={renderData(rowToDisplay, EDIT_BUTTON_ID)}>
        {headerIds.map((id) => renderData(rowToDisplay, id))}
      </SidebarHeader>
      <SidebarTable>
        {idOrAuthor &&
          renderDataRow(
            rowToDisplay,
            "id",
            editRow ? "columnHeader.author" : "columnHeader.naturalId",
          )}
        {rowIds.map((id) =>
          renderDataRow(rowToDisplay, id, "columnHeader." + id),
        )}
        {renderRow(rowToDisplay.original.id, "columnHeader.id")}
      </SidebarTable>
    </TableContextProvider>
  );
}
