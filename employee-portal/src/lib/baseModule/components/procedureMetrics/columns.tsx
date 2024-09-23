/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureMetric } from "@eshg/employee-portal-api/base";
import { SortingState, createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";
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

export const procedureMetricsColumns = [
  columnHelper.accessor("procedureType", {
    header: columnName.procedureType,
    cell: (props) => procedureTypeNames[props.getValue()],
  }),
  columnHelper.accessor("totalCount", {
    header: columnName.totalCount,
  }),
  columnHelper.accessor("openOrDraftCount", {
    header: columnName.openOrDraftCount,
  }),
  columnHelper.accessor("inProgressCount", {
    header: columnName.inProgressCount,
  }),
  columnHelper.accessor("closedCount", {
    header: columnName.closedCount,
  }),
  columnHelper.accessor("abortedCount", {
    header: columnName.abortedCount,
  }),
  columnHelper.accessor("averageDuration", {
    header: columnName.averageDuration,
    cell: (props) => {
      const value = props.getValue();
      return isDefined(value) ? formatDurationRounded(value) : "-";
    },
  }),
];

export const initialSorting: SortingState = [
  {
    id: "procedureType",
    desc: true,
  },
];
