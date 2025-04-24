/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  type ApiWebSearchOverviewEntry,
  type ApiWebSearchStatus,
} from "@eshg/inspection-api";
import {
  ActionsMenu,
  DataTable,
  TableSheet,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { DeleteOutlined, Edit, PlayArrow } from "@mui/icons-material";
import { ColorPaletteProp } from "@mui/joy";
import {
  CellContext,
  ColumnHelper,
  Row,
  createColumnHelper,
} from "@tanstack/react-table";

import {
  useDeleteWebSearch,
  useStartWebSearch,
} from "@/lib/businessModules/inspection/api/mutations/webSearch";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

const columnHelper: ColumnHelper<ApiWebSearchOverviewEntry> =
  createColumnHelper<ApiWebSearchOverviewEntry>();

export function FacilityWebSearchTable({
  data,
  loading,
}: Readonly<{
  data: ApiWebSearchOverviewEntry[];
  loading: boolean;
}>) {
  const { mutateAsync: startWebSearch } = useStartWebSearch();
  const { mutateAsync: deleteWebSearch } = useDeleteWebSearch();
  const { openConfirmationDialog } = useConfirmationDialog();

  function isRunning(info: CellContext<ApiWebSearchOverviewEntry, unknown>) {
    return info.row.original.searchStatus == "RUNNING";
  }

  function translateStatus(searchStatus: ApiWebSearchStatus) {
    switch (searchStatus) {
      case "NEW":
        return "Noch nicht gestartet";
      case "IDLE":
        return "Ok";
      case "RUNNING":
        return "Läuft...";
      case "ERRONEOUS":
        return "Fehler";
      case "PAUSED":
        return "Pausiert";
    }
  }

  async function handleStartEntry(entry: ApiWebSearchOverviewEntry) {
    await startWebSearch(entry.id);
  }

  function handleDeleteEntry(entry: ApiWebSearchOverviewEntry) {
    openConfirmationDialog({
      title: "Suche löschen: " + entry.name,
      description: "Aktion kann nicht rückgängig gemacht werden",
      confirmLabel: "Löschen",
      color: "danger",
      onConfirm: async () => {
        await deleteWebSearch(entry.id);
      },
    });
  }

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.renderValue(),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("facilityCount", {
      header: "Unternehmen",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("lastExecution", {
      header: "ausgeführt am",
      cell: (props) => formatDateTime(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("lastSuccessfulExecution", {
      header: "letzter Erfolg",
      cell: (props) => formatDateTime(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("searchStatus", {
      header: "Status",
      cell: (props) => translateStatus(props.getValue()),
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
              label: "Suche bearbeiten...",
              onClick: routes.facilities.webSearch.edit(info.row.original.id),
              startDecorator: <Edit />,
            },
            ...(!isRunning(info)
              ? [
                  {
                    label: "Manuell starten",
                    onClick: () => handleStartEntry(info.row.original),
                    startDecorator: <PlayArrow />,
                  },
                  {
                    label: "Löschen",
                    onClick: () => handleDeleteEntry(info.row.original),
                    color: "danger" as ColorPaletteProp,
                    startDecorator: <DeleteOutlined />,
                  },
                ]
              : []),
          ]}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];

  return (
    <TableSheet loading={loading}>
      <DataTable
        data={data}
        columns={columns}
        rowNavigation={{
          route: getRowRoute,
          focusColumnAccessorKey: "name",
        }}
        striped
      />
    </TableSheet>
  );
}

function getRowRoute(row: Row<ApiWebSearchOverviewEntry>) {
  return row.original.facilityCount
    ? routes.facilities.webSearch.results(row.original.id)
    : routes.facilities.webSearch.edit(row.original.id);
}
