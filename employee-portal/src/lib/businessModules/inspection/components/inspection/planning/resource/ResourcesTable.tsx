/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ApiInspectionResource } from "@eshg/employee-portal-api/inspection";
import { ApiResourceType } from "@eshg/employee-portal-api/inspection";
import {
  CameraAltOutlined,
  DeleteOutlined,
  DevicesOtherOutlined,
  DirectionsBikeOutlined,
  DirectionsCarOutlined,
  LaptopOutlined,
  MeetingRoomOutlined,
  TabletOutlined,
} from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { resourceTypeNames } from "@/lib/baseModule/components/resources/constants";
import { useDeleteResource } from "@/lib/businessModules/inspection/api/mutations/resources";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { formatDateTimeRange } from "@/lib/shared/helpers/dateTime";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export interface ResourcesTableProps {
  readonly?: boolean;
  data: ApiInspectionResource[];
  procedureId: string;
}

export function ResourcesTable({
  readonly,
  data,
  procedureId,
}: Readonly<ResourcesTableProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();

  const columnHelper: ColumnHelper<ApiInspectionResource> =
    createColumnHelper<ApiInspectionResource>();

  const { mutateAsync: deleteResource } = useDeleteResource();

  function handleDelete(resourceId: string) {
    openConfirmationDialog({
      title: "Ressource entfernen",
      description: "Aktion kann nicht rückgängig gemacht werden",
      confirmLabel: "Entfernen",
      color: "danger",
      onConfirm: async () => {
        await deleteResource({ id: procedureId, resourceId });
      },
    });
  }

  const iconMap = {
    [ApiResourceType.Bicycle]: <DirectionsBikeOutlined />,
    [ApiResourceType.Camera]: <CameraAltOutlined />,
    [ApiResourceType.Car]: <DirectionsCarOutlined />,
    [ApiResourceType.Laptop]: <LaptopOutlined />,
    [ApiResourceType.MeasuringDevice]: <DevicesOtherOutlined />,
    [ApiResourceType.MeasuringKit]: <DevicesOtherOutlined />,
    [ApiResourceType.Misc]: <DevicesOtherOutlined />,
    [ApiResourceType.Room]: <MeetingRoomOutlined />,
    [ApiResourceType.Tablet]: <TabletOutlined />,
  } satisfies Record<ApiResourceType, ReactNode>;

  const resourceColumns = [
    columnHelper.accessor("type", {
      header: "Symbol",
      id: "icon",
      cell: (props) => iconMap[props.getValue()],
      meta: {
        cellStyle: "icon",
        width: "48px",
      },
    }),
    columnHelper.accessor("type", {
      header: "Typ",
      cell: (props) => resourceTypeNames[props.getValue()],
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (props) => props.getValue(),
    }),
    columnHelper.display({
      header: "Buchungszeitraum",
      id: "bookingTimeRange",
      cell: (props) =>
        formatDateTimeRange(props.row.original.start, props.row.original.end),
    }),
    !readonly
      ? columnHelper.accessor("baseResourceId", {
          header: "Aktion",
          cell: (info) => (
            <IconButton
              aria-label="Buchung stornieren"
              variant="plain"
              color="danger"
              onClick={() => handleDelete(info.getValue())}
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
      data={data}
      columns={resourceColumns}
      showColumnHeaders={false}
    />
  );
}
