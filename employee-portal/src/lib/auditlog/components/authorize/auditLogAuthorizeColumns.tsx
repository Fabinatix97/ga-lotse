/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LockOpenOutlined } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";

import { AuditLog } from "@/lib/auditlog/api/models/auditlog";
import { auditLogSourceNames } from "@/lib/shared/components/auditlog/constants";

const columnHelper = createColumnHelper<AuditLog>();

export const auditLogAuthorizeColumns = [
  columnHelper.accessor("createdAt", {
    header: "Erstellt am",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("auditLogSource", {
    header: "Modul",
    cell: (props) => auditLogSourceNames[props.getValue()],
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("validGrantedAccessCount", {
    header: "Status",
    cell: (props) => {
      return props.getValue() !== 0 ? (
        <Chip color="primary">Freigegeben für {props.getValue()} User</Chip>
      ) : null;
    },
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.display({
    id: "authorize",
    cell: () => {
      return <LockOpenOutlined color="primary" aria-label="freigabe" />;
    },
    meta: {
      cellStyle: "icon",
      width: 48,
      canNavigate: { parentRow: true },
    },
  }),
];
