/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetRelevantArchivableProceduresSortBy,
  ApiProcedure,
} from "@eshg/employee-portal-api/businessProcedures";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<ApiProcedure>();
export const archiveAdminTableColumns = [
  columnHelper.accessor("closedAt", {
    id: ApiGetRelevantArchivableProceduresSortBy.ClosedAt,
    header: "Geschlossen am",
    cell: (props) => formatDate(props.getValue()),
    meta: {
      width: "240px",
    },
  }),
  columnHelper.accessor("exportedAt", {
    id: ApiGetRelevantArchivableProceduresSortBy.ExportedAt,
    header: "Zuletzt exportiert",
    cell: (props) => {
      const exportedAt = props.getValue();
      if (exportedAt === undefined) {
        return "offen";
      }
      return formatDateTime(exportedAt);
    },
    meta: {
      width: "260px",
    },
  }),
];
