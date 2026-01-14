/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { createColumnHelper } from "@tanstack/react-table";

import { formatDate } from "@eshg/lib-portal";
import { ApiGetArchivableProceduresSortBy } from "@eshg/lib-procedures-api";

import { PROCEDURE_TYPE_NAMES } from "../../../../translations/procedures";
import { ArchivableProcedure } from "../../api/models/archivableProcedure";
import { ArchivingRelevanceChip } from "../ArchivingRelevanceChip";

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
    cell: (props) => PROCEDURE_TYPE_NAMES[props.getValue()],
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
