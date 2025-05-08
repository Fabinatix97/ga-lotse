/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete, Edit } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu } from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiInformationStatementTemplate,
  ApiInformationStatementTemplateState,
} from "@eshg/travel-medicine-api";

import { LabelList } from "@/lib/baseModule/components/labels/LabelList";
import { templateStatusColors } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/constants";
import { translateInformationStatementTemplateStateType } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/translations";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

const columnHelper: ColumnHelper<ApiInformationStatementTemplate> =
  createColumnHelper<ApiInformationStatementTemplate>();

export function informationStatementColumns(
  deleteEntry: (entryId: string) => Promise<void>,
) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("title", {
      header: "Titel",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("state", {
      header: "Status",
      cell: (props) => (
        <Chip size="md" color={templateStatusColors[props.getValue()]}>
          {translateInformationStatementTemplateStateType(props.getValue())}
        </Chip>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("diseases", {
      header: "Krankheiten",
      enableSorting: false,
      cell: (props) => (
        <LabelList labels={props.getValue()} maxVisible={5} chipSize="md" />
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("modifiedAt", {
      header: "Bearbeitet am",
      cell: (props) => formatDateTime(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt am",
      cell: (props) => formatDateTime(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      cell: (info) => (
        <ActionsMenu
          actionItems={[
            {
              label:
                info.row.original.state ===
                ApiInformationStatementTemplateState.Final
                  ? "Kopie dieser Vorlage erstellen"
                  : "Bearbeiten",
              onClick: routes.informationStatementTemplates.details(
                info.row.original.id,
              ),
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
