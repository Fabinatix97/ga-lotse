/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspectionIncident } from "@eshg/inspection-api";
import { DeleteOutlined, Edit } from "@mui/icons-material";
import { ColorPaletteProp } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { useDeleteIncident } from "@/lib/businessModules/inspection/api/mutations/incidents";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

interface IncidentsTableProps {
  incidents: ApiInspectionIncident[];
  readOnly: boolean;
  onEdit: (incident: ApiInspectionIncident) => void;
}

export function IncidentsTable({
  incidents,
  readOnly,
  onEdit,
}: Readonly<IncidentsTableProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const { mutateAsync: deleteIncident } = useDeleteIncident();

  function handleDelete(inspectionId: string, incidentId: string) {
    openConfirmationDialog({
      title: "Vorkommnis entfernen",
      description: "Aktion kann nicht rückgängig gemacht werden",
      confirmLabel: "Entfernen",
      color: "danger",
      onConfirm: async () => {
        await deleteIncident({
          inspectionId,
          incidentId,
        });
      },
    });
  }

  function handleEdit(incident: ApiInspectionIncident) {
    onEdit(incident);
  }

  const columnHelper: ColumnHelper<ApiInspectionIncident> =
    createColumnHelper<ApiInspectionIncident>();

  const incidentColumns = [
    columnHelper.accessor("checklistNumber", {
      header: "Referenz",
      enableSorting: false,
      cell: (props) => {
        const incident = props.row.original;
        return incident.checklistNumber === undefined
          ? undefined
          : `Checkliste ${incident.checklistNumber}: ${incident.sectionNumber}.${incident.elementNumber}`;
      },
      meta: {
        width: "160px",
      },
    }),
    columnHelper.accessor("title", {
      header: "Titel",
      enableSorting: false,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Beschreibung",
      enableSorting: false,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("incidentId", {
      header: "Aktionen",
      enableSorting: false,
      cell: (info) =>
        !readOnly && (
          <ActionsMenu
            actionItems={[
              {
                label: "Anpassen",
                onClick: () => handleEdit(info.row.original),
                startDecorator: <Edit />,
              },
              ...(info.row.original.checklistNumber === undefined
                ? [
                    {
                      label: "Löschen",
                      color: "danger" as ColorPaletteProp,
                      startDecorator: <DeleteOutlined />,
                      onClick: () =>
                        handleDelete(
                          info.row.original.inspectionId,
                          info.row.original.incidentId,
                        ),
                    },
                  ]
                : []),
            ]}
          />
        ),
      meta: {
        width: "100px",
      },
    }),
  ];

  return <DataTable data={incidents} columns={incidentColumns} />;
}
