/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  type ApiInspPendingFacility,
  ApiProcedureStatus,
} from "@eshg/inspection-api";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { OpenInNewOutlined } from "@mui/icons-material";
import { Chip, IconButton, Stack, Typography } from "@mui/joy";
import { ColumnHelper, Row, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import { translateProcedureStatus } from "@/lib/baseModule/api/procedures/enums";
import { OfflineSwitch } from "@/lib/businessModules/inspection/components/inspection/OfflineSwitch";
import {
  inspectionResultColors,
  translateInspectionResult,
  translateInspectionType,
} from "@/lib/businessModules/inspection/shared/enums";
import { useInspectionPrecacheState } from "@/lib/businessModules/inspection/shared/offline/useInspectionPrecacheState";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { statusColors } from "@/lib/shared/components/procedures/constants";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

const columnHelper: ColumnHelper<ApiInspPendingFacility> =
  createColumnHelper<ApiInspPendingFacility>();

export function createInspectionHistoryColumns(
  thisInspectionId: string,
  offlineSwitch: boolean,
) {
  return [
    columnHelper.display({
      header: "",
      id: "openInNewTab",
      cell: (ctx) =>
        ctx.row.original.inspection!.id !== thisInspectionId && (
          <OfflineFork
            online={
              <IconButton
                aria-label="In neuem Tab öffnen"
                color="primary"
                onClick={() =>
                  window.open(
                    getPendingFacilityRowRoute(ctx.row),
                    "_blank",
                    "noreferrer",
                  )
                }
              >
                <OpenInNewOutlined fontSize="xl" />
              </IconButton>
            }
            offline={
              <IconButton aria-label="In neuem Tab öffnen" disabled={true}>
                <OpenInNewOutlined fontSize="xl" />
              </IconButton>
            }
            procedureId={ctx.row.original.inspection!.id}
          />
        ),
      meta: {
        cellStyle: "icon",
        width: "48px",
        headerLabel: "In neuem Tab öffnen",
      },
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (ctx) => (
        <GrayWhenOffline procedureId={ctx.row.original.inspection!.id}>
          {ctx.getValue()}
        </GrayWhenOffline>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 200,
      },
    }),
    columnHelper.accessor("street", {
      header: "Adresse",
      cell: (ctx) => (
        <GrayWhenOffline procedureId={ctx.row.original.inspection!.id}>
          {formatAddress(ctx.row.original)}
        </GrayWhenOffline>
      ),
      sortingFn: sortBy(formatAddress),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 361,
      },
    }),
    columnHelper.accessor("executedFrom", {
      header: "Begehungsdatum",
      cell: (ctx) => (
        <GrayWhenOffline procedureId={ctx.row.original.inspection!.id}>
          {formatDate(ctx.getValue())}
        </GrayWhenOffline>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 147,
      },
    }),
    columnHelper.accessor("inspection.type", {
      header: "Typ",
      cell: (ctx) => {
        if (!ctx.row.original.inspection) return null;
        return (
          <GrayWhenOffline procedureId={ctx.row.original.inspection.id}>
            {translateInspectionType(ctx.getValue())}
          </GrayWhenOffline>
        );
      },
      sortingFn: sortBy(
        (row) =>
          row.inspection?.type && translateInspectionType(row.inspection.type),
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 180,
      },
    }),
    columnHelper.accessor("inspection.result", {
      header: "Ergebnis",
      cell: (ctx) => {
        const value = ctx.getValue();
        if (!value) return null;
        return (
          <Chip color={inspectionResultColors[value]}>
            {translateInspectionResult(value)}
          </Chip>
        );
      },
      sortingFn: sortBy(
        (row) =>
          row.inspection?.result &&
          translateInspectionResult(row.inspection.result),
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 270,
      },
    }),
    columnHelper.accessor("inspection.status", {
      header: "Status",
      cell: (ctx) => {
        const value = ctx.getValue();
        if (!value) return null;
        return (
          <Chip color={statusColors[value]}>
            {translateProcedureStatus(value)}
          </Chip>
        );
      },
      sortingFn: sortBy(
        (row) =>
          row.inspection?.status &&
          translateProcedureStatus(row.inspection.status),
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 160,
      },
    }),
    offlineSwitch
      ? columnHelper.display({
          header: "Offline",
          cell: (ctx) => {
            const inspection = ctx.row.original.inspection;
            return (
              inspection && (
                <Stack
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <OfflineSwitch
                    aria-label={`${ctx.row.original.name} offline-fähig`}
                    procedureId={inspection.id}
                    currentPhase={inspection.phase}
                  />
                </Stack>
              )
            );
          },
          meta: {
            width: 109,
          },
        })
      : null,
  ].filter((it) => it !== null);
}

export function getPendingFacilityRowRoute(row: Row<ApiInspPendingFacility>) {
  const hasDraftInspection =
    row.original.inspection?.status === ApiProcedureStatus.Draft;
  return !hasDraftInspection
    ? routes.procedures.details(row.original.inspection!.id)
    : routes.procedures.new(row.original.inspection!.id);
}

export function formatAddress({
  street,
  houseNo,
  postalCode,
  city,
}: ApiInspPendingFacility) {
  return houseNo
    ? `${street} ${houseNo}, ${postalCode} ${city}`
    : `${street}, ${postalCode} ${city}`;
}

function sortBy(accessor: (row: ApiInspPendingFacility) => string | undefined) {
  return (a: Row<ApiInspPendingFacility>, b: Row<ApiInspPendingFacility>) => {
    const aValue = accessor(a.original) ?? "";
    const bValue = accessor(b.original) ?? "";
    return aValue.localeCompare(bValue);
  };
}

function GrayWhenOffline({
  children,
  procedureId,
}: Readonly<{
  children: ReactNode;
  procedureId: string;
}>) {
  return (
    <OfflineFork
      online={<Typography>{children}</Typography>}
      offline={<Typography textColor="neutral.400">{children}</Typography>}
      procedureId={procedureId}
    />
  );
}

export function OfflineFork({
  offline,
  online,
  procedureId,
}: Readonly<{
  offline?: ReactNode | ReactNode[];
  online?: ReactNode | ReactNode[];
  procedureId: string;
}>) {
  const isOfflineEnabled = useIsOfflineFeatureEnabled();
  const isOffline = useIsOffline();
  const [state] = useInspectionPrecacheState(procedureId);

  if (isOfflineEnabled && isOffline && state !== "success") return offline;
  return online;
}
