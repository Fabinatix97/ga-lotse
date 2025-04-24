/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_NAMES,
} from "@eshg/lib-employee-portal";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import {
  ApiEmployeeOmsProcedureOverview,
  ApiMedicalOpinionStatus,
} from "@eshg/official-medical-service-api";
import { WarningAmberOutlined } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/joy";
import {
  CellContext,
  ColumnHelper,
  createColumnHelper,
} from "@tanstack/react-table";
import { addDays, isAfter } from "date-fns";
import { isDefined } from "remeda";

import { statusColorsMedicalOpinionStatus } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { STATUS_NAMES_MEDICAL_OPINION_STATUS } from "@/lib/businessModules/officialMedicalService/shared/translations";

function daysInFuture(numberOfDays: number) {
  return addDays(new Date(), numberOfDays);
}

const columnHelper: ColumnHelper<ApiEmployeeOmsProcedureOverview> =
  createColumnHelper<ApiEmployeeOmsProcedureOverview>();

function evaluateContext(
  ctx: CellContext<ApiEmployeeOmsProcedureOverview, unknown>,
  medicalOpinionLeadTime: number,
): {
  isUrgentCase: boolean;
  alertTooltip: string;
} {
  const isHighPriorityConcern = ctx.row.original.concern?.highPriority ?? false;
  const isOpinionOverdue =
    ctx.row.original.medicalOpinionStatus ===
      ApiMedicalOpinionStatus.InProgress &&
    isDefined(ctx.row.original.medicalOpinionCutOffDate) &&
    isAfter(
      daysInFuture(medicalOpinionLeadTime),
      ctx.row.original.medicalOpinionCutOffDate,
    );

  const alertTooltip = [
    isHighPriorityConcern ? "Dringender Fall" : "",
    isOpinionOverdue ? "Gutachten überfällig" : "",
  ]
    .filter((s) => isNonEmptyString(s))
    .join(", ");

  return {
    isUrgentCase: isHighPriorityConcern || isOpinionOverdue,
    alertTooltip: alertTooltip,
  };
}

export function procedureOverviewTableColumns(medicalOpinionLeadTime: number) {
  return [
    columnHelper.display({
      id: "Dringlich",
      header: "",
      cell: (ctx) => {
        const procedureEvaluation = evaluateContext(
          ctx,
          medicalOpinionLeadTime,
        );
        return (
          procedureEvaluation.isUrgentCase && (
            <Tooltip
              title={procedureEvaluation.alertTooltip}
              arrow
              placement="top"
              sx={{ marginBottom: -0.5 }}
            >
              <WarningAmberOutlined
                sx={{ position: "relative", zIndex: 2 }}
                color="danger"
              />
            </Tooltip>
          )
        );
      },
      meta: {
        width: 24,
        cellStyle: "icon",
        headerLabel: "Dringlich",
      },
    }),
    columnHelper.accessor("firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("lastName", {
      header: "Nachname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
      enableSorting: true,
      meta: {
        width: 120,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("facilityName", {
      header: "Auftraggeber",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("physicianName", {
      header: "Ärzt:in",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("status", {
      header: "Vorgang Status",
      cell: (props) => (
        <Chip color={PROCEDURE_STATUS_COLORS[props.getValue()]} size="md">
          {PROCEDURE_STATUS_NAMES[props.getValue()]}
        </Chip>
      ),
      enableSorting: true,
      meta: {
        width: 130,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("medicalOpinionCutOffDate", {
      header: "Gutachtenfrist",
      cell: (props) => formatDate(props.getValue()),
      enableSorting: false,
      meta: {
        width: 140,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("medicalOpinionStatus", {
      header: "Gutachten Status",
      cell: (props) => (
        <Chip
          color={statusColorsMedicalOpinionStatus[props.getValue()]}
          size="md"
        >
          {STATUS_NAMES_MEDICAL_OPINION_STATUS[props.getValue()]}
        </Chip>
      ),
      enableSorting: true,
      meta: {
        width: 140,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("nextAppointment", {
      header: "Nächster Termin",
      cell: (props) => formatDateTime(props.getValue()),
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];
}
