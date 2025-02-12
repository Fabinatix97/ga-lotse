/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  type ApiInspPendingFacility,
  ApiProcedureStatus,
} from "@eshg/inspection-api";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { IconButton, Stack } from "@mui/joy";
import { ColumnHelper, Row, createColumnHelper } from "@tanstack/react-table";

import { translateProcedureStatus } from "@/lib/baseModule/api/procedures/enums";
import { DuplicateIcon } from "@/lib/businessModules/inspection/components/icons/DuplicateIcon";
import { OfflineSwitch } from "@/lib/businessModules/inspection/components/inspection/OfflineSwitch";
import {
  translateInspectionPhase,
  translateInspectionType,
  translatePendingFacilityKind,
} from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

const columnHelper: ColumnHelper<ApiInspPendingFacility> =
  createColumnHelper<ApiInspPendingFacility>();

export function createPendingFacilitiesColumns(
  handleViewIncidentsClick: (
    inspectionId: string,
    facilityName: string,
  ) => void,
  openReviewFacilityDuplicateSidebar: (inspectionId: string) => void,
  openInspectionFacilityDuplicateSidebar: (inspectionId: string) => void,
  showOfflineColumn: boolean,
) {
  return [
    columnHelper.display({
      id: "possibleDuplicate",
      header: "",
      cell: (ctx) =>
        (ctx.row.original.possibleFacilityDuplicate && (
          <IconButton
            aria-label="Einrichtungsduplikat"
            sx={{ color: "warning.900" }}
            onClick={() =>
              openReviewFacilityDuplicateSidebar(
                ctx.row.original.inspection!.id,
              )
            }
          >
            <DuplicateIcon />
          </IconButton>
        )) ||
        (ctx.row.original.inspection!.possibleInspectionDuplicate && (
          <IconButton
            aria-label="Vorgangsduplikat"
            sx={{ color: "warning.900" }}
            onClick={() =>
              openInspectionFacilityDuplicateSidebar(
                ctx.row.original.inspection!.id,
              )
            }
          >
            <DuplicateIcon />
          </IconButton>
        )),
      meta: {
        width: 48,
        cellStyle: "icon",
        headerLabel: "Mögliche Duplikate",
      },
    }),
    columnHelper.accessor("kind", {
      header: "Art",
      cell: (ctx) => translatePendingFacilityKind(ctx.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 114,
      },
    }),
    columnHelper.accessor("plannedFrom", {
      header: "Geplant ab",
      cell: (ctx) => formatDateTime(ctx.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 147,
      },
    }),
    columnHelper.accessor("objecttype.name", {
      header: "Objekttyp",
      cell: (ctx) => ctx.row.original.objecttype?.name ?? "",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 160,
      },
    }),
    columnHelper.accessor("name", {
      header: "Name",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 200,
      },
    }),
    columnHelper.accessor("postalCode", {
      header: "PLZ",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 83,
      },
    }),
    columnHelper.accessor("city", {
      header: "Stadt",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 130,
      },
    }),
    columnHelper.accessor("street", {
      header: "Straße",
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 361,
      },
    }),
    columnHelper.accessor("inspection.status", {
      header: "Status",
      cell: (ctx) =>
        ctx.row.original.inspection?.status &&
        translateProcedureStatus(ctx.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 125,
      },
    }),
    columnHelper.accessor("inspection.type", {
      header: "Typ",
      cell: (ctx) =>
        ctx.row.original.inspection?.type &&
        translateInspectionType(ctx.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 180,
      },
    }),
    columnHelper.accessor("inspection.phase", {
      header: "Phase",
      cell: (ctx) =>
        ctx.row.original.inspection?.phase &&
        translateInspectionPhase(ctx.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 159,
      },
    }),
    columnHelper.accessor("inspection.numberOfIncidents", {
      header: "Vork.",
      cell: (ctx) =>
        ctx.getValue() > 0 && (
          <ButtonLink
            data-testid={"incidents " + ctx.row.original.name}
            onClick={() => {
              if (ctx.row.original.inspection) {
                handleViewIncidentsClick(
                  ctx.row.original.inspection.id,
                  ctx.row.original.name,
                );
              }
            }}
          >
            {ctx.getValue()}
          </ButtonLink>
        ),
      meta: {
        width: 70,
      },
    }),
    showOfflineColumn
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
