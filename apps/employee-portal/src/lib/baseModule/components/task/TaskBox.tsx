/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Chip, Sheet, Stack, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { isDefined } from "remeda";

import { ApiTask } from "@eshg/base-api";
import { DetailsList, NavigationLink } from "@eshg/lib-portal";

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
      variant="outlined"
      data-testid="taskbox"
      sx={{
        position: "relative",
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
      role="listitem"
    >
      <Box
        aria-label={`Aufgabe öffnen: ${task.summary}`}
        href={resolveProcedureDetailsRoute({
          businessModule: task.businessModule,
          procedureId: task.procedureId,
        })}
        component={NavigationLink}
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />
      <DetailsList>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignContent="center"
        >
          <Box component="dt" sx={visuallyHidden}>
            Zusammenfassung
          </Box>
          <Typography
            level="title-md"
            startDecorator={task.isOverdue && <OverdueTaskIcon />}
            component="dd"
          >
            {task.summary}
          </Typography>
        </Stack>
        <Stack direction="row" gap={0.5}>
          <Typography level="body-md" component="dt">
            Fachmodul:
          </Typography>
          <Typography level="body-md" component="dd">
            {businessModuleNames[task.businessModule]}
          </Typography>
        </Stack>
        <Stack direction="row" gap={0.5}>
          <Typography level="body-md" component="dt">
            Typ:
          </Typography>
          <Typography level="body-md" component="dd">
            {taskTypeNames[task.taskType]}
          </Typography>
        </Stack>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          flexWrap="wrap"
          paddingTop={1}
        >
          <Stack spacing={2} direction="row" flexWrap="wrap">
            <Box sx={visuallyHidden} component="dt">
              Datum
            </Box>
            <Chip role="definition">
              {task.createdAt.toLocaleString("de-DE", {
                dateStyle: "short",
              })}
            </Chip>
            <Box sx={visuallyHidden} component="dt">
              Uhrzeit
            </Box>
            <Chip role="definition">
              {task.createdAt.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              Uhr
            </Chip>
            <Box sx={visuallyHidden} component="dt">
              Status
            </Box>
            <Chip
              color={task.taskStatus === "OPEN" ? "warning" : "primary"}
              role="definition"
            >
              {task.taskStatus === "OPEN" ? "Offen" : "Geschlossen"}
            </Chip>
          </Stack>
          {isDefined(task.dueAt) && (
            <Stack direction="row" gap={0.5}>
              <Typography level="body-md" component="dt">
                Frist:
              </Typography>
              <Typography level="body-md" component="dd">
                {task.dueAt.toLocaleString("de-DE", {
                  dateStyle: "short",
                })}
              </Typography>
            </Stack>
          )}
        </Stack>
      </DetailsList>
    </Sheet>
  );
}
