/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { PROCEDURE_TYPE_NAMES } from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { ApiInboxProcedure } from "@eshg/lib-procedures-api";

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
      return isDefined(value) ? PROCEDURE_TYPE_NAMES[value] : "";
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
