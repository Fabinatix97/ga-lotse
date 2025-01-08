/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTask } from "@eshg/employee-portal-api/base";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Chip, Sheet, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { OverdueTaskIcon } from "@/lib/baseModule/components/task/OverdueTaskIcon";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { theme } from "@/lib/baseModule/theme/theme";
import {
  businessModuleNames,
  taskTypeNames,
} from "@/lib/shared/components/procedures/constants";

export function TaskBox({ task }: { task: ApiTask }) {
  return (
    <Sheet
      href={resolveProcedureDetailsRoute({
        businessModule: task.businessModule,
        procedureId: task.procedureId,
      })}
      component={NavigationLink}
      variant="outlined"
      data-testid="taskbox"
      sx={{
        textDecoration: "none",
        padding: 3,
        borderRadius: "lg",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        backgroundColor: "background.body",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: theme.palette.neutral.plainHoverBg,
        },
      }}
    >
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignContent="center"
      >
        <Typography
          level="title-md"
          startDecorator={task.isOverdue && <OverdueTaskIcon />}
        >
          {task.summary}
        </Typography>
      </Stack>
      <Typography level="body-md">
        Fachmodul: {businessModuleNames[task.businessModule]}
      </Typography>
      <Typography level="body-md">
        Typ: {taskTypeNames[task.taskType]}
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        paddingTop={1}
      >
        <Stack spacing={2} direction="row" flexWrap={"wrap"}>
          <Chip>
            {task.createdAt.toLocaleString("de-DE", {
              dateStyle: "short",
            })}
          </Chip>
          <Chip>
            {task.createdAt.toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            Uhr
          </Chip>
          <Chip color={task.taskStatus === "OPEN" ? "warning" : "primary"}>
            {task.taskStatus === "OPEN" ? "Offen" : "Geschlossen"}
          </Chip>
        </Stack>
        {isDefined(task.dueAt) && (
          <Typography
            level="body-md"
            color={task.isOverdue ? "danger" : undefined}
          >
            Frist:{" "}
            {task.dueAt.toLocaleString("de-DE", {
              dateStyle: "short",
            })}
          </Typography>
        )}
      </Stack>
    </Sheet>
  );
}
