/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ActionsMenu } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ApiResource, ApiVersion } from "@eshg/opendata-api";
import Add from "@mui/icons-material/Add";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { IconButton, Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

type ResourceOrVersion =
  | {
      type: "resource";
      data: ApiResource;
    }
  | {
      type: "version";
      data: ApiVersion;
      resource: ApiResource;
    };

export type OpenDataRow = {
  name: string;
  description?: string;
  version?: string;
  publicationDate?: Date;
  statisticStartDate?: Date;
  statisticEndDate?: Date;
  subRows?: OpenDataVersion[];
} & ResourceOrVersion;

export type OpenDataVersion = OpenDataRow & { type: "version" };
export type OpenDataResource = OpenDataRow & { type: "resource" };

const columnHelper = createColumnHelper<OpenDataRow>();

export function openDataColumns(options: {
  handleAddNewVersion: (resource: ApiResource) => void;
  handleDeleteVersion: (version: ApiVersion) => void;
}) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
      enableSorting: false,
      meta: {
        width: "18rem",
        canNavigate: {
          subRow: true,
        },
      },
    }),
    columnHelper.accessor("publicationDate", {
      header: "Veröffl. Datum",
      enableSorting: false,
      cell: (ctx) => formatDate(ctx.getValue()),
      meta: {
        width: "8rem",
        canNavigate: {
          subRow: true,
        },
      },
    }),
    columnHelper.display({
      header: "Zeitraum",
      cell: (ctx) => {
        const { statisticStartDate, statisticEndDate } = ctx.row.original;
        if (!statisticStartDate || !statisticEndDate) {
          return "";
        }

        return (
          <>
            {statisticStartDate.getFullYear()} bis{" "}
            {statisticEndDate.getFullYear()}
          </>
        );
      },
      meta: {
        width: "8rem",
        canNavigate: {
          subRow: true,
        },
      },
    }),
    columnHelper.accessor("version", {
      header: "Versionen",
      enableSorting: false,
      meta: {
        width: "8rem",
        canNavigate: {
          subRow: true,
        },
      },
    }),
    columnHelper.accessor("description", {
      header: "Beschreibung",
      enableSorting: false,
      meta: {
        canNavigate: {
          subRow: true,
        },
      },
    }),
    columnHelper.display({
      header: "Aktion",
      id: "show",
      cell: (ctx) => {
        const { type, data } = ctx.row.original;
        if (type === "version") {
          return (
            <Stack direction="row" justifyContent="flex-end">
              <IconButton
                title="Datensatz löschen"
                aria-label="Datensatz löschen"
                variant="plain"
                color="danger"
                onClick={() => options.handleDeleteVersion(data)}
              >
                <DeleteOutlined />
              </IconButton>
            </Stack>
          );
        }

        return (
          <ActionsMenu
            actionItems={[
              {
                label: "Neue Version anlegen",
                startDecorator: <Add />,
                onClick: () => options.handleAddNewVersion(data),
              },
            ]}
          />
        );
      },
      meta: {
        cellStyle: "button",
        width: "6rem",
        textAlign: "right",
      },
    }),
  ];
}

export function mapToOpenDataRow(data: ApiResource): OpenDataRow {
  return {
    type: "resource",
    data: data,
    name: getResourceDisplayName(data),
    version: `${data.versions?.length ?? 0}`,
    subRows: data.versions?.map((version) =>
      mapVersionToOpenDataRow(version, data),
    ),
  };
}

function getResourceDisplayName(data: ApiResource): string {
  return data.versions[0]?.versionName ?? data.resourceName;
}

function mapVersionToOpenDataRow(data: ApiVersion, resource: ApiResource) {
  return {
    type: "version",
    data: data,
    resource: resource,
    name: data.versionName,
    description: data.description,
    version: `${data.major}.${data.minor}`,
    publicationDate: data.publicationDate,
    statisticStartDate: data.statisticStartDate,
    statisticEndDate: data.statisticEndDate,
  } satisfies OpenDataRow;
}
