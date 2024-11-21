/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  type ApiInspPendingFacility,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/inspection";
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
      id: "openInNewTab",
      cell: (ctx) =>
        ctx.row.original.inspection!.id !== thisInspectionId && (
          <OfflineFork
            online={
              <IconButton
                aria-label="In neuem Tab öffnen"
                onClick={() =>
                  window.open(
                    getPendingFacilityRowRoute(ctx.row),
                    "_blank",
                    "noreferrer",
                  )
                }
              >
                <OpenInNewOutlined
                  fontSize="xl"
                  sx={{
                    color: (theme) => `${theme.palette.primary.outlinedColor}`,
                  }}
                />
              </IconButton>
            }
            offline={
              <IconButton aria-label="In neuem Tab öffnen" disabled={true}>
                <OpenInNewOutlined
                  fontSize="xl"
                  sx={{ color: "neutral.400" }}
                />
              </IconButton>
            }
            procedureId={ctx.row.original.inspection!.id}
          />
        ),
      meta: {
        cellStyle: "icon",
        width: "48px",
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
          {formatAddress(
            ctx.row.original.street,
            ctx.row.original.houseNo,
            ctx.row.original.postalCode,
            ctx.row.original.city,
          )}
        </GrayWhenOffline>
      ),
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
      cell: (ctx) => (
        <GrayWhenOffline procedureId={ctx.row.original.inspection!.id}>
          {ctx.row.original.inspection?.type &&
            translateInspectionType(ctx.getValue())}
        </GrayWhenOffline>
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
      cell: (ctx) =>
        ctx.row.original.inspection?.result && (
          <Chip color={inspectionResultColors[ctx.getValue()!]}>
            {translateInspectionResult(ctx.getValue()!)}
          </Chip>
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
      cell: (ctx) =>
        ctx.row.original.inspection?.status && (
          <Chip color={statusColors[ctx.getValue()]}>
            {translateProcedureStatus(ctx.getValue())}
          </Chip>
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

export function formatAddress(
  street: string,
  houseNumber: string | undefined | null,
  postalCode: string,
  city: string,
) {
  return houseNumber
    ? `${street} ${houseNumber}, ${postalCode} ${city}`
    : `${street}, ${postalCode} ${city}`;
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
