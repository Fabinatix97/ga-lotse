/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatCurrency } from "@eshg/lib-portal/formatters/numbers";
import { ApiOtherServiceTemplate } from "@eshg/travel-medicine-api";
import { Delete, Edit } from "@mui/icons-material";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

interface OtherServiceTemplatesColumnsProps {
  editEntry: (otherServiceTemplateId: ApiOtherServiceTemplate) => void;
  deleteEntry: (entryId: string) => void;
}

export function otherServiceTemplatesColumns({
  editEntry,
  deleteEntry,
}: OtherServiceTemplatesColumnsProps) {
  return [
    columnHelper.accessor("description", {
      header: "Name",
    }),
    columnHelper.accessor("fee", {
      header: "Preis",
      cell: (props) =>
        formatCurrency(props.getValue(), {
          localeOption: "manual",
          locale: "de-DE",
        }),
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
      cell: (info) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Bearbeiten",
              onClick: () => editEntry(info.row.original),
              startDecorator: <Edit />,
            },
            {
              label: "Löschen",
              onClick: () => deleteEntry(info.row.original.id),
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

const columnHelper: ColumnHelper<ApiOtherServiceTemplate> =
  createColumnHelper<ApiOtherServiceTemplate>();
