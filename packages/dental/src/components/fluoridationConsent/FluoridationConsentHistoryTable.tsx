/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { ApiFluoridationConsent } from "@eshg/dental-api";
import { DataTable, TableSheet } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal";

import { formatBooleanWithUnknown } from "../../utils/formatters";

interface FluoridationConsentHistoryTableProps {
  fluoridationConsent: ApiFluoridationConsent[];
}

export function FluoridationConsentHistoryTable(
  props: FluoridationConsentHistoryTableProps,
) {
  return (
    <TableSheet>
      <DataTable
        data={props.fluoridationConsent}
        columns={COLUMNS}
        enableSortingRemoval={false}
      />
    </TableSheet>
  );
}

const columnHelper = createColumnHelper<ApiFluoridationConsent>();

const COLUMNS = [
  columnHelper.accessor("consented", {
    header: "Einverständnis",
    cell: (props) => formatBooleanWithUnknown(props.getValue()),
    meta: {
      width: 80,
    },
  }),
  columnHelper.accessor("dateOfConsent", {
    header: "Datum",
    cell: (props) => formatDate(props.getValue()),
    meta: {
      width: 120,
    },
  }),
];
