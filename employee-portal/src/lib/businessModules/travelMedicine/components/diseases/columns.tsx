/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { ApiDisease } from "@eshg/travel-medicine-api";
import { Delete, Edit } from "@mui/icons-material";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { LOCALE_OPTION, formatCurrency } from "@/lib/shared/helpers/numbers";

const columnHelper: ColumnHelper<ApiDisease> = createColumnHelper<ApiDisease>();

export function columns(
  deleteEntry: (entryId: string, diseaseName: string) => void,
  editEntry: (disease: ApiDisease) => void,
) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("estimatedFee", {
      header: "Bürgerportal Preisangabe",
      cell: (props) =>
        formatCurrency(props.getValue(), {
          localOption: LOCALE_OPTION.manual,
          locale: "de-DE",
        }),
    }),
    columnHelper.accessor("visibleToCitizenPortal", {
      header: "Sichtbarkeit im Bürgerportal",
      cell: (props) => (props.getValue() ? "sichtbar" : "verborgen"),
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
  ];
}
