/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiDocument,
  ApiDocumentStatus,
} from "@eshg/official-medical-service-api";
import { Delete, ModeEditOutlineOutlined } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { statusColorsDocumentStatus } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { STATUS_NAMES_DOCUMENT_STATUS } from "@/lib/businessModules/officialMedicalService/shared/translations";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

const columnHelper: ColumnHelper<ApiDocument> =
  createColumnHelper<ApiDocument>();

interface ColumnsProps {
  onEdit: (document: ApiDocument) => void;
  onDelete: (document: ApiDocument) => Promise<void>;
  isProcedureFinalized: () => boolean;
}

export function Columns({
  onEdit,
  onDelete,
  isProcedureFinalized,
}: Readonly<ColumnsProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();

  return [
    columnHelper.accessor("documentTypeDe", {
      header: "Dokumentenart",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: { width: 250, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("helpTextDe", {
      header: "Hilfstext",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: { width: 250, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("documentStatus", {
      header: "Status",
      cell: (props) => {
        const status: ApiDocumentStatus = props.getValue();
        return (
          <Chip color={statusColorsDocumentStatus[status]} size="md">
            {STATUS_NAMES_DOCUMENT_STATUS[status]}
          </Chip>
        );
      },
      enableSorting: true,
      meta: { width: 120, canNavigate: { parentRow: true } },
    }),
    // ToDo: missing in R4D,
    // columnHelper.accessor("uploadInCitizenPortal", {
    //   header: "Upload-Option",
    //   cell: (props) => {
    //     return (
    //       <Chip color="primary" size="md">
    //         {props.getValue() ? "Mitarbeiter:in" : "Bürger:in"}
    //       </Chip>
    //     );
    //   },
    //   enableSorting: true,
    // }),
    columnHelper.accessor("uploadedBy", {
      header: "Hochgeladen von",
      cell: (props) => {
        return (
          props.getValue() && (
            <Chip
              color={props.getValue() === "INTERN" ? "primary" : "warning"}
              size="md"
            >
              {props.getValue() === "INTERN" ? "Intern" : "Extern"}
            </Chip>
          )
        );
      },
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("mandatoryDocument", {
      header: "Pflicht",
      cell: (props) => {
        return (
          <Chip color={props.getValue() ? "danger" : "primary"} size="md">
            {props.getValue() ? "Ja" : "Nein"}
          </Chip>
        );
      },
      enableSorting: true,
      meta: { width: 100, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("lastDocumentUpload", {
      header: "Letzte Aktualisierung",
      cell: (props) => formatDateTime(props.getValue()),
      enableSorting: true,
      meta: { width: 180, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("files", {
      header: "Dateien",
      cell: (props) => props.getValue()?.length,
      enableSorting: true,
      meta: { width: 90, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("note", {
      header: "Stichwörter",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: { width: 200, canNavigate: { parentRow: true } },
    }),
    columnHelper.display({
      header: "Aktionen",
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Bearbeiten",
              onClick: () => onEdit(props.row.original),
              startDecorator: <ModeEditOutlineOutlined />,
            },
            ...(isProcedureFinalized()
              ? []
              : [
                  {
                    label: "Löschen",
                    onClick: () => {
                      openConfirmationDialog({
                        title: "Dokument löschen?",
                        description:
                          "Möchten Sie das Dokument wirklich löschen? Die Aktion lässt sich nicht widerrufen.",
                        confirmLabel: "Löschen",
                        onConfirm: async () => {
                          await onDelete(props.row.original);
                        },
                        color: "danger",
                      });
                    },
                    startDecorator: <Delete color="danger" />,
                  },
                ]),
          ]}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}
