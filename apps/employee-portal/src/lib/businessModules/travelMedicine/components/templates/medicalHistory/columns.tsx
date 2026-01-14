/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DeleteOutlined,
  EditOutlined,
  FormatListBulletedOutlined,
} from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu } from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal";
import {
  ApiMedicalHistoryTemplate,
  ApiMedicalHistoryTemplateState,
} from "@eshg/travel-medicine-api";

import { templateStatusColors } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/constants";
import { translateMedicalHistoryTemplateStateType } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/translations";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";

const columnHelper: ColumnHelper<ApiMedicalHistoryTemplate> =
  createColumnHelper<ApiMedicalHistoryTemplate>();

export function medicalHistoryColumns(
  updateMainFlag: (entryId: string) => Promise<void>,
  updateFollowUpFlag: (entryId: string) => Promise<void>,
  deleteEntry: (entryId: string) => Promise<void>,
) {
  return [
    columnHelper.accessor("title", {
      header: "Name",
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
          {translateMedicalHistoryTemplateStateType(props.getValue())}
        </Chip>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      header: "Bogenart",
      cell: (info) => {
        if (info.row.original.mainFlag && !info.row.original.followUpFlag) {
          return "Hauptanamnese";
        } else if (
          !info.row.original.mainFlag &&
          info.row.original.followUpFlag
        ) {
          return "Folgeanamnese";
        } else if (
          info.row.original.mainFlag &&
          info.row.original.followUpFlag
        ) {
          return "Haupt- und Folgeanamnese";
        } else {
          return "";
        }
      },
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
    columnHelper.accessor("modifiedAt", {
      header: "Bearbeitet am",
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
            ...(info.row.original.state !==
              ApiMedicalHistoryTemplateState.Draft &&
            !info.row.original.mainFlag
              ? [
                  {
                    label: "Als Hauptbogen kennzeichnen",
                    onClick: () => updateMainFlag(info.row.original.id),
                    startDecorator: <FormatListBulletedOutlined />,
                  },
                ]
              : []),
            ...(info.row.original.state !==
              ApiMedicalHistoryTemplateState.Draft &&
            !info.row.original.followUpFlag
              ? [
                  {
                    label: "Als Folgebogen kennzeichnen",
                    onClick: () => updateFollowUpFlag(info.row.original.id),
                    startDecorator: <FormatListBulletedOutlined />,
                  },
                ]
              : []),
            {
              label:
                info.row.original.state === ApiMedicalHistoryTemplateState.Final
                  ? "Kopie dieser Vorlage erstellen"
                  : "Bearbeiten",
              onClick: routes.medicalHistoryTemplates.details(
                info.row.original.id,
              ),
              startDecorator: <EditOutlined />,
            },
            {
              label: "Löschen",
              onClick: () => deleteEntry(info.row.original.id),
              color: "danger",
              startDecorator: <DeleteOutlined color="danger" />,
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
