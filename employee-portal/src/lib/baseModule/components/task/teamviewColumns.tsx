/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";

import { OverdueTaskIcon } from "@/lib/baseModule/components/task/OverdueTaskIcon";
import { TaskRow } from "@/lib/baseModule/components/task/Teamview";

const columnHelper = createColumnHelper<TaskRow>();

export const teamviewColumns = [
  columnHelper.display({
    id: "isOverdue",
    cell: (props) => {
      return (
        props.row.original.isOverdue && (
          <Stack alignItems="center">
            <OverdueTaskIcon />
          </Stack>
        )
      );
    },
    meta: {
      width: "3rem",
      canNavigate: {
        subRow: true,
      },
    },
  }),
  columnHelper.accessor("name", {
    header: "Name",
    meta: {
      width: "15rem",
      canNavigate: {
        subRow: true,
      },
    },
  }),
  columnHelper.accessor("tasks", {
    header: "Aufgaben",
    cell: (props) => {
      const tasks = props.row.original.tasks;

      if (typeof tasks === "object") {
        return (
          <Stack direction="row" spacing={1}>
            <Chip
              size="sm"
              color="primary"
              aria-label="Anstehende Aufgaben"
              title="Anstehende Aufgaben"
            >
              {tasks.nonOverdueTaskCount}
            </Chip>

            <Chip
              size="sm"
              color="danger"
              aria-label="Überfällige Aufgaben"
              title="Überfällige Aufgaben"
            >
              {tasks.overdueTaskCount}
            </Chip>
          </Stack>
        );
      }

      return props.getValue();
    },
    meta: {
      width: "30rem",
      canNavigate: {
        subRow: true,
      },
    },
  }),
  columnHelper.accessor("dueAtInDays", {
    header: "Frist",
    cell: (props) => {
      const value = props.getValue();
      return (
        isDefined(value) && (
          <Typography
            color={props.row.original.isOverdue ? "danger" : undefined}
          >
            {value} Tage
          </Typography>
        )
      );
    },
    meta: {
      width: "10rem",
      canNavigate: {
        subRow: true,
      },
    },
  }),
  columnHelper.accessor("assignedBy", {
    header: "Zugewiesen von",
    meta: {
      width: "15rem",
      canNavigate: {
        subRow: true,
      },
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Erstellungsdatum",
    cell: (props) => {
      const value = props.getValue();
      return value ? formatDate(new Date(value), "de") : undefined;
    },
    meta: {
      width: "10rem",
      canNavigate: {
        subRow: true,
      },
    },
  }),
];
