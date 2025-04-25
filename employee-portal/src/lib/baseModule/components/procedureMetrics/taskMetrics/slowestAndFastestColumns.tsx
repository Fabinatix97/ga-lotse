/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createColumnHelper } from "@tanstack/react-table";

import { ApiProcedureWithDuration } from "@eshg/base-api";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";

import { formatOptionalDuration } from "./formatOptionalDuration";

const columnHelper = createColumnHelper<ApiProcedureWithDuration>();

const meta = {
  canNavigate: {
    parentRow: true,
  },
  width: "6rem",
};

export const slowestAndFastestTasksColumns = [
  columnHelper.accessor("createdAt", {
    header: "Erstellt am",
    cell: (props) => formatDate(props.getValue()),
    meta,
  }),
  columnHelper.accessor("duration", {
    header: "Durchschnittliche Dauer",
    cell: (props) => {
      return formatOptionalDuration(props.getValue());
    },
    meta,
  }),
];
