/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Chip } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import {
  GeoShapeInfo,
  GeoShapeStatus,
} from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

const columnHelper = createColumnHelper<GeoShapeInfo>();

export function geoShapeTableColumns(
  archiveGeoShapeWithConfirmation: (geoShape: GeoShapeInfo) => void,
  activateGeoShapeWithConfirmation: (id: string) => void,
  deleteGeoShapeWithConfirmation: (geoShape: GeoShapeInfo) => void,
) {
  return [
    columnHelper.accessor("title", { header: "Name" }),
    columnHelper.accessor("createdAt", {
      header: "Hinzugefügt am",
      cell: (props) => formatDate(props.getValue(), "DE"),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      enableSorting: false,
      cell: (props) =>
        props.getValue() === GeoShapeStatus.Active ? (
          <Chip size="lg" color="success">
            Aktiv
          </Chip>
        ) : (
          <Chip size="lg" color="primary">
            Archiviert
          </Chip>
        ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      enableSorting: false,
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            props.row.original.status === GeoShapeStatus.Active
              ? {
                  label: "Archivieren",
                  onClick: () =>
                    archiveGeoShapeWithConfirmation({ ...props.row.original }),
                }
              : {
                  label: "Archivierung aufheben",
                  onClick: () =>
                    activateGeoShapeWithConfirmation(props.row.original.id),
                },
            {
              label: "Löschen",
              onClick: () =>
                deleteGeoShapeWithConfirmation({ ...props.row.original }),
            },
          ]}
        />
      ),
      meta: {
        width: 96,
        cellStyle: "button",
      },
    }),
  ];
}
