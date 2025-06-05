/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SortingState, createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { ApiProcedureMetric } from "@eshg/base-api";
import { PROCEDURE_TYPE_NAMES } from "@eshg/lib-employee-portal";

import { formatDurationRounded } from "@/lib/shared/helpers/dateTime";

export const columnName = {
  businessModule: "Fachmodul",
  procedureType: "Typ",
  totalCount: "Alle Vorgänge",
  openOrDraftCount: "Offen / Entwurf",
  inProgressCount: "in Bearbeitung",
  closedCount: "Erledigt",
  abortedCount: "Abgebrochen",
  averageDuration: "Dauer",
} satisfies Record<keyof ApiProcedureMetric, string>;

const columnHelper = createColumnHelper<ApiProcedureMetric>();

const meta = {
  canNavigate: {
    parentRow: true,
  },
  width: "6rem",
};

export const procedureMetricsColumns = [
  columnHelper.accessor("procedureType", {
    header: columnName.procedureType,
    cell: (props) => PROCEDURE_TYPE_NAMES[props.getValue()],
    meta,
  }),
  columnHelper.accessor("totalCount", {
    header: columnName.totalCount,
    meta,
  }),
  columnHelper.accessor("openOrDraftCount", {
    header: columnName.openOrDraftCount,
    meta,
  }),
  columnHelper.accessor("inProgressCount", {
    header: columnName.inProgressCount,
    meta,
  }),
  columnHelper.accessor("closedCount", {
    header: columnName.closedCount,
    meta,
  }),
  columnHelper.accessor("abortedCount", {
    header: columnName.abortedCount,
    meta,
  }),
  columnHelper.accessor("averageDuration", {
    header: columnName.averageDuration,
    cell: (props) => {
      const value = props.getValue();
      return isDefined(value) ? formatDurationRounded(value) : "-";
    },
    meta,
  }),
];

export const initialSorting: SortingState = [
  {
    id: "procedureType",
    desc: true,
  },
];
