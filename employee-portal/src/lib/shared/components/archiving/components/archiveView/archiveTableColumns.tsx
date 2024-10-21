/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetArchivableProceduresSortBy } from "@eshg/employee-portal-api/businessProcedures";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createColumnHelper } from "@tanstack/react-table";

import { ArchivableProcedure } from "@/lib/shared/components/archiving/api/models/archivableProcedure";
import { ArchivingRelevanceChip } from "@/lib/shared/components/archiving/components/ArchivingRelevanceChip";
import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";

const columnHelper = createColumnHelper<ArchivableProcedure>();
export const archiveTableColumns = [
  columnHelper.accessor("closedAt", {
    id: ApiGetArchivableProceduresSortBy.ClosedAt,
    header: "Geschlossen am",
    cell: (props) => formatDate(props.getValue()),
    meta: {
      width: "240px",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("procedureType", {
    id: ApiGetArchivableProceduresSortBy.ProcedureType,
    header: "Vorgangsart",
    cell: (props) => procedureTypeNames[props.getValue()],
    meta: {
      width: "260px",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor(
    "archivingRelevanceSettings.defaultArchivingRelevance",
    {
      header: "Standard-Aktion",
      cell: (props) => (
        <ArchivingRelevanceChip archivingRelevance={props.getValue()} />
      ),
      enableSorting: false,
      meta: {
        width: "260px",
        canNavigate: {
          parentRow: true,
        },
      },
    },
  ),
];
