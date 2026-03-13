/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, Edit, FileUploadOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { ApiUserRole } from "@eshg/base-api";
import { ApiSamplingPoint } from "@eshg/inspection-api";
import {
  ButtonBar,
  DataTable,
  IconButton,
  TablePage,
  TableSheet,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { formatUserName } from "@eshg/lib-portal";

import { useGetSamplingPoints } from "@/lib/businessModules/inspection/api/queries/samplingPoints";
import { useAddSamplingPointSidebar } from "@/lib/businessModules/inspection/components/SamplingPoints/AddSamplingPointSidebar";
import { useEditFacilitySidebar } from "@/lib/businessModules/inspection/components/SamplingPoints/EditFacilitySidebar";

import { useEditSamplingPointSidebar } from "./EditSamplingPointSidebar";

interface FacilityNode {
  facilityId?: string;
  facilityName?: string;
  userName?: string;
  userId?: string;
  subNodes: ApiSamplingPoint[];
}

type TableRow = FacilityNode | ApiSamplingPoint;

export function SamplingPointsTable() {
  const { data: samplingPoints, isFetching } = useGetSamplingPoints("", "");

  const addSidebar = useAddSamplingPointSidebar();

  const canEdit = useHasUserRoleCheck(ApiUserRole.InspectionObjecttypesWrite);

  const editSamplingPointSidebar = useEditSamplingPointSidebar();
  const editFacilitySidebar = useEditFacilitySidebar();

  function mapPointsToFacilities(points: ApiSamplingPoint[]): FacilityNode[] {
    const facilityMap = points.reduce<Record<string, FacilityNode>>(
      (acc, point) => {
        const facilityKey = point.facility?.externalId ?? "UNKNOWN";

        acc[facilityKey] ??= {
          facilityId: point.facility?.externalId,
          facilityName: point.facility?.name,
          userId: point.facility?.user?.userId,
          userName: formatUserName(point.facility?.user),
          subNodes: [],
        };

        acc[facilityKey].subNodes.push(point);

        return acc;
      },
      {},
    );

    return Object.values(facilityMap);
  }

  const columnHelper = createColumnHelper<TableRow>();

  function isFacilityRow(row: TableRow): row is FacilityNode {
    return "subNodes" in row;
  }

  const columns = [
    columnHelper.display({
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const original = row.original;

        if (isFacilityRow(original)) {
          return (
            <strong>{original.facilityName ?? "Unbekannte Einrichtung"}</strong>
          );
        }

        return original.name;
      },
    }),
    columnHelper.display({
      id: "zid",
      header: "ZID",
      cell: ({ row }) => (isFacilityRow(row.original) ? "" : row.original.zid),
    }),
    columnHelper.display({
      id: "userName",
      header: "Zuständiger Mitarbeiter::in",
      cell: ({ row }) =>
        isFacilityRow(row.original) && row.original.userId !== undefined
          ? row.original.userName
          : "",
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      enableSorting: false,
      meta: {
        width: 96,
      },
      cell: ({ row }) => {
        const original = row.original;

        if (isFacilityRow(original)) {
          return (
            <IconButton
              variant="plain"
              aria-label="bearbeiten"
              label="Einrichtung Bearbeiten"
              onClick={() => {
                editFacilitySidebar.open({
                  facilityId: original.facilityId,
                  facilityName: original.facilityName,
                  userName: original.userName,
                  userId: original.userId,
                });
              }}
            >
              <Edit />
            </IconButton>
          );
        }

        return (
          <IconButton
            variant="plain"
            aria-label="bearbeiten"
            label="Entnahmestelle Bearbeiten"
            onClick={() => {
              editSamplingPointSidebar.open({
                samplingPoint: original,
              });
            }}
          >
            <Edit />
          </IconButton>
        );
      },
    }),
  ];

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          right={
            <Stack
              direction="row"
              spacing={2}
              alignSelf="flex-end"
              sx={{ paddingBottom: 2 }}
            >
              <Button
                color="primary"
                variant="plain"
                aria-label="Entnahmestelle hinzufügen"
                startDecorator={<Add />}
                onClick={() => {
                  addSidebar.open();
                }}
              >
                <Typography component="span" color="primary" level="title-md">
                  Entnahmestelle hinzufügen
                </Typography>
              </Button>
              <Button
                color="primary"
                variant="plain"
                aria-label="Entnahmestellen importieren"
                startDecorator={<FileUploadOutlined />}
                onClick={() => {
                  addSidebar.open();
                }}
              >
                <Typography component="span" color="primary" level="title-md">
                  Entnahmestellen importieren
                </Typography>
              </Button>
            </Stack>
          }
        />
      }
    >
      <TableSheet loading={isFetching}>
        <DataTable
          data={mapPointsToFacilities(samplingPoints)}
          indentSize={24}
          indentSubRows
          getSubRows={(row) => (isFacilityRow(row) ? row.subNodes : undefined)}
          columns={columns}
          rowNavigation={
            canEdit
              ? {
                  onClick: (row) => () => {
                    if (!isFacilityRow(row.original)) {
                      editSamplingPointSidebar.open({
                        samplingPoint: row.original,
                      });
                    }
                  },
                  focusColumnAccessorKey: "name",
                }
              : undefined
          }
          striped
        />
      </TableSheet>
    </TablePage>
  );
}
