/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Sheet, Stack, Typography } from "@mui/joy";

import { NoEntriesMessage } from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal";

import { useFetchTasksForDashboardQuery } from "@/lib/baseModule/api/queries/tasks";
import { TaskBox } from "@/lib/baseModule/components/task/TaskBox";
import { routes } from "@/lib/baseModule/shared/routes";

export function DashboardTaskList() {
  const tasks = useFetchTasksForDashboardQuery().data;
  return (
    <Sheet
      variant="outlined"
      sx={{
        padding: 2,
        px: 3,
        borderRadius: "lg",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
      role="region"
      aria-labelledby="tasks-label"
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography level="h3" component="h2" id="tasks-label">
            Aufgaben
          </Typography>
          <Stack justifyContent="flex-end">
            <InternalLinkButton
              variant="plain"
              href={routes.tasks.index}
              endDecorator={<ArrowForwardIcon />}
            >
              Zur Aufgabenübersicht
            </InternalLinkButton>
          </Stack>
        </Stack>
        <Stack spacing={2} role="list">
          {tasks.map((task) => (
            <TaskBox key={task.taskId} task={task} />
          ))}
          {tasks.length === 0 && <NoEntriesMessage />}
        </Stack>
      </Stack>
    </Sheet>
  );
}
