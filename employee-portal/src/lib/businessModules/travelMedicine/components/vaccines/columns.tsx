/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete, Edit } from "@mui/icons-material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { ActionsMenu } from "@eshg/lib-employee-portal";
import { formatCurrency, formatDateTime } from "@eshg/lib-portal";
import { ApiVaccine } from "@eshg/travel-medicine-api";

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";

const columnHelper: ColumnHelper<ApiVaccine> = createColumnHelper<ApiVaccine>();

interface VaccineTableColumnsProps {
  deleteEntry: (entryId: string, vaccineName: string) => void;
  editEntry: (vaccine: ApiVaccine) => void;
}

export function columns({ deleteEntry, editEntry }: VaccineTableColumnsProps) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("disease", {
      header: "Krankheit",
      cell: (props) => props.getValue().name,
    }),
    columnHelper.accessor("numVaccinations", {
      header: "Anzahl Impfungen",
    }),
    columnHelper.accessor("fee", {
      header: "Preis",
      cell: (props) =>
        formatCurrency(props.getValue(), {
          localeOption: "manual",
          locale: "de-DE",
        }),
    }),
    columnHelper.accessor("currentBatchId", {
      header: "Aktuelle Chargennummer",
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: (props) => formatDateTime(props.getValue()),
    }),
    columnHelper.accessor("modifiedAt", {
      header: "Bearbeitet am",
      cell: (props) => formatDateTime(props.getValue()),
    }),
    columnHelper.display({
      header: "Aktionen",
      cell: (cell) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Bearbeiten",
              onClick: () => editEntry(cell.row.original),
              startDecorator: <Edit />,
            },
            {
              label: "Inventar-Impfstoff",
              onClick: baseRoutes.inventory.details(
                cell.row.original.inventoryVaccineId,
              ),
              startDecorator: <ListAltIcon />,
            },
            {
              label: "Löschen",
              onClick: () =>
                deleteEntry(cell.row.original.id, cell.row.original.name),
              color: "danger",
              startDecorator: <Delete color="danger" />,
            },
          ]}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ].filter(isDefined);
}
