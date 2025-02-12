/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAccessibleAuditLog } from "@eshg/auditlog-api";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { VisibilityOutlined } from "@mui/icons-material";
import { Chip, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { auditLogSourceNames } from "@/lib/shared/components/auditlog/constants";

const columnHelper = createColumnHelper<ApiAccessibleAuditLog>();

export const auditLogAccessibleColumns = [
  columnHelper.accessor("auditLog.date", {
    header: "Erstellt am",
    cell: (props) => formatDate(props.getValue()),
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("auditLog.source", {
    header: "Modul",
    cell: (props) => auditLogSourceNames[props.getValue()],
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("expiresAt", {
    header: "Status",
    cell: (props) => {
      return (
        <Chip color="primary">
          Freigegeben bis {formatDate(props.getValue())}
        </Chip>
      );
    },
    enableSorting: false,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.display({
    header: "Aktionen",
    id: "show",
    cell: () => {
      return (
        <Typography
          color="primary"
          startDecorator={
            <VisibilityOutlined
              size={"md"}
              color="primary"
              aria-label="anzeigen"
            />
          }
        >
          Auditlog anzeigen
        </Typography>
      );
    },
    meta: {
      width: 196,
      canNavigate: { parentRow: true },
    },
  }),
];
