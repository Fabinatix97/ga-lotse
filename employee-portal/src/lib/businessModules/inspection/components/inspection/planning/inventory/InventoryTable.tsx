/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspectionInventory } from "@eshg/employee-portal-api/inspection";
import { DeleteOutlined } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { inventoryItemTypeNames } from "@/lib/baseModule/components/inventory/constants";
import { useModifyInventory } from "@/lib/businessModules/inspection/api/mutations/inventory";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DataTable } from "@/lib/shared/components/table/DataTable";

interface InventoryTableProps {
  readonly?: boolean;
  procedureId: string;
  inspectionInventories: ApiInspectionInventory[];
}

export function InventoryTable({
  readonly,
  procedureId,
  inspectionInventories,
}: Readonly<InventoryTableProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const { mutateAsync: modifyInventory } = useModifyInventory();

  function handleDelete(inventoryId: string, bookingId?: number) {
    openConfirmationDialog({
      title: "Inventar entfernen",
      description: "Aktion kann nicht rückgängig gemacht werden",
      confirmLabel: "Entfernen",
      color: "danger",
      onConfirm: async () => {
        await modifyInventory({
          id: procedureId,
          apiUpdateInspectionModifyInventoryRequest: {
            inventoryId: inventoryId,
            bookingId: bookingId,
            count: 0,
          },
        });
      },
    });
  }

  const columnHelper = createColumnHelper<ApiInspectionInventory>();

  const resourceColumns = [
    columnHelper.display({
      id: "index",
      cell: (props) => `${props.row.index + 1}.`,
      meta: {
        width: "48px",
      },
    }),
    columnHelper.accessor("type", {
      header: "Typ",
      cell: (props) => inventoryItemTypeNames[props.getValue()],
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("count", {
      header: "Anzahl",
      cell: (props) => <Chip color="primary">{props.getValue()} Stk.</Chip>,
    }),
    !readonly
      ? columnHelper.accessor("baseInventoryId", {
          header: "Aktion",
          cell: (info) => (
            <IconButton
              aria-label="Buchung stornieren"
              variant="plain"
              color="danger"
              onClick={() =>
                handleDelete(
                  info.row.original.baseInventoryId,
                  info.row.original.bookingId,
                )
              }
            >
              <DeleteOutlined />
            </IconButton>
          ),
          meta: {
            cellStyle: "button",
            width: "48px",
          },
        })
      : undefined,
  ].filter(isDefined);

  return (
    <DataTable
      data={inspectionInventories}
      columns={resourceColumns}
      showColumnHeaders={false}
    />
  );
}
