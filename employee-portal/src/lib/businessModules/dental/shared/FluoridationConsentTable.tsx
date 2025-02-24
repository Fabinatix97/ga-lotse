/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiFluoridationConsent } from "@eshg/dental-api";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

interface FluoridationConsentTableProps {
  fluoridationConsent: ApiFluoridationConsent[];
}

export function FluoridationConsentTable(props: FluoridationConsentTableProps) {
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
    cell: (props) => displayBoolean(props.getValue()),
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
