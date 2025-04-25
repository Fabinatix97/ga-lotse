/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { ApiFluoridationConsent } from "@eshg/dental-api";
import {
  DataTable,
  TableSheet,
  formatBoolean,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";

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
    cell: (props) => formatBoolean(props.getValue()),
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
