/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiInboxProcedure } from "@eshg/employee-portal-api/businessProcedures";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";
import { InboxProcedureStatusChip } from "@/lib/shared/components/procedures/inbox/InboxProcedureStatusChip";

const columnHelper = createColumnHelper<ApiInboxProcedure>();

export const inboxProcedureColumns = [
  columnHelper.accessor("inboxProgressEntry.subject", {
    enableSorting: false,
    header: "Betreff",
    cell: (props) => props.getValue(),
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("inboxProcedureType", {
    enableSorting: false,
    header: "Vorgangstyp",
    cell: (props) => {
      const value = props.getValue();
      return isDefined(value) ? procedureTypeNames[value] : "";
    },
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("inboxProcedureStatus", {
    enableSorting: false,
    header: "Status",
    cell: (props) => <InboxProcedureStatusChip status={props.getValue()} />,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Erstellt am",
    cell: (props) => formatDateTime(props.getValue()),
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
];
