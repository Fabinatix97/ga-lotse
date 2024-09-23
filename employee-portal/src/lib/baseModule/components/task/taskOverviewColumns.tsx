/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Chip, Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { Task } from "@/lib/baseModule/api/models/task";
import { OverdueTaskIcon } from "@/lib/baseModule/components/task/OverdueTaskIcon";
import {
  businessModuleNames,
  statusColors,
  taskStatusNames,
  taskTypeNames,
} from "@/lib/shared/components/procedures/constants";

const columnHelper = createColumnHelper<Task>();

export const tasksColumns = [
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
      cellStyle: "icon",
      width: 48,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Erstellt am",
    cell: (props) => formatDateTime(props.getValue()),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("businessModule", {
    header: "Fachmodul",
    cell: (props) => businessModuleNames[props.getValue()],
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("taskType", {
    header: "Aufgabenart",
    cell: (props) => taskTypeNames[props.getValue()],
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("summary", {
    header: "Beschreibung",
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("taskStatus", {
    header: "Status",
    cell: (props) => (
      <Chip color={statusColors[props.getValue()]}>
        {taskStatusNames[props.getValue()]}
      </Chip>
    ),
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("assignedByName", {
    header: "Zugewiesen von",
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("dueAt", {
    header: "Frist",
    cell: (props) => (
      <Typography color={props.row.original.isOverdue ? "danger" : undefined}>
        {formatDateTime(props.getValue())}
      </Typography>
    ),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];
