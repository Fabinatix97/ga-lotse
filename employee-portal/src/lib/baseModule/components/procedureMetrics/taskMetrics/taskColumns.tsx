/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTaskMetric } from "@eshg/employee-portal-api/base";
import { createColumnHelper } from "@tanstack/react-table";

import { taskTypeNames } from "@/lib/shared/components/procedures/constants";

import { formatOptionalDuration } from "./formatOptionalDuration";

const columnHelper = createColumnHelper<ApiTaskMetric>();

const meta = {
  width: "6rem",
};

export const tasksColumns = [
  columnHelper.accessor("taskType", {
    header: "Bezeichnung",
    cell: (props) => taskTypeNames[props.getValue()],
    meta: {
      width: "10rem",
    },
  }),
  columnHelper.accessor("averageDuration", {
    header: "Durchschnittliche Dauer",
    cell: (props) => {
      return formatOptionalDuration(props.getValue());
    },
    meta,
  }),
  columnHelper.accessor("noOccurrencesCount", {
    header: "Kein Auftreten",
    meta,
  }),
  columnHelper.accessor("oneOccurrenceCount", {
    header: "Auftreten: 1x",
    meta,
  }),
  columnHelper.accessor("twoOccurrencesCount", {
    header: "Auftreten: 2x",
    meta,
  }),
  columnHelper.accessor("moreThanTwoOccurrencesCount", {
    header: "Auftreten: >2",
    meta,
  }),
];
