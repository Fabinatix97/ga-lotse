/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  CheckOutlined,
  HourglassEmptyOutlined,
  RocketLaunchOutlined,
} from "@mui/icons-material";
import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { endOfToday } from "date-fns";
import Image from "next/image";
import { startTransition, useState } from "react";
import { isDefined } from "remeda";

import {
  ApiBusinessModule,
  ApiProcedureStatus,
  ApiProcedureType,
  ApiProcedureWithDuration,
} from "@eshg/base-api";
import { DataTable, TableSheet } from "@eshg/lib-employee-portal";

import { useTaskMetricsQuery } from "@/lib/baseModule/api/queries/taskMetrics";
import { TimeRangeSelect } from "@/lib/baseModule/components/procedureMetrics/TimeRangeSelect";
import { lastXMonthsInDate } from "@/lib/baseModule/components/procedureMetrics/rangeSelectHelper";
import { resolveProcedureDefinitionDiagram } from "@/lib/baseModule/moduleRegister/procedureDefinitionDiagramsResolver";
import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { FlashCard } from "@/lib/shared/components/cards/FlashCard";
import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";

import { formatOptionalDuration } from "./formatOptionalDuration";
import { slowestAndFastestTasksColumns } from "./slowestAndFastestColumns";
import { tasksColumns } from "./taskColumns";

export function TaskMetricsDisplay(props: {
  businessModuleName: ApiBusinessModule;
  procedureType: ApiProcedureType;
}) {
  const timeRangeEnd = endOfToday();

  const [selectedTimeRange, setSelectedTimeRange] = useState(12);

  const timeRangeStart = lastXMonthsInDate(timeRangeEnd, selectedTimeRange);

  const taskMetrics = useTaskMetricsQuery({
    businessModuleName: props.businessModuleName,
    procedureType: props.procedureType,
    timeRangeStart,
    timeRangeEnd,
  });

  const procedureDefinitionDiagram = resolveProcedureDefinitionDiagram(
    props.businessModuleName,
    props.procedureType,
  );

  return (
    <Stack gap={3}>
      <TimeRangeSelect
        optionsInMonths={[1, 3, 6, 12]}
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={(value) =>
          startTransition(() => {
            setSelectedTimeRange(value);
          })
        }
      />
      <Stack role="list" direction="row" flexWrap="wrap" gap={2}>
        <FlashCard
          color="primary"
          title="Geschlossene Vorgänge"
          figure={`${taskMetrics.closedProcedureCount}`}
          icon={<CheckOutlined fontSize="xl4" />}
        />
        <FlashCard
          color="danger"
          title="Langsamster Vorgang"
          figure={`${formatOptionalDuration(taskMetrics.slowestProcedures[0]?.duration)}`}
          icon={<HourglassEmptyOutlined fontSize="xl4" />}
        />
        <FlashCard
          color="success"
          title="Schnellster Vorgang"
          figure={`${formatOptionalDuration(taskMetrics.fastestProcedures[0]?.duration)}`}
          icon={<RocketLaunchOutlined fontSize="xl4" />}
        />
      </Stack>
      <Stack gap={3}>
        <TableSheet
          title={
            <Stack gap={3} marginBottom={1}>
              <Typography level="h3" component="h2">
                Aufgaben
              </Typography>
              <Typography>
                Auftreten der Aufgaben in abgeschlossenen Vorgängen.
              </Typography>
            </Stack>
          }
        >
          <DataTable
            data={taskMetrics.taskMetrics}
            columns={tasksColumns}
            sorting={{
              manualSorting: false,
            }}
          />
        </TableSheet>

        <SlowestAndFastestTable
          title="Schnellste Vorgänge"
          data={taskMetrics.fastestProcedures}
          businessModuleName={props.businessModuleName}
        />
        <SlowestAndFastestTable
          title="Langsamste Vorgänge"
          data={taskMetrics.slowestProcedures}
          businessModuleName={props.businessModuleName}
        />

        {isDefined(procedureDefinitionDiagram) && (
          <Sheet sx={{ overflowX: "auto" }}>
            <Typography level="h3" component="h2" marginBottom={3}>
              Aufgabenabfolge
            </Typography>
            <Box
              sx={{
                width: "max-content",
                marginInline: "auto",
              }}
            >
              <Image
                src={procedureDefinitionDiagram}
                alt={`Prozessdefinition ${procedureTypeNames[props.procedureType]}`}
              />
            </Box>
          </Sheet>
        )}
      </Stack>
    </Stack>
  );
}

function SlowestAndFastestTable({
  title,
  data,
  businessModuleName,
}: {
  title: string;
  data: ApiProcedureWithDuration[];
  businessModuleName: string;
}) {
  return (
    <TableSheet
      title={
        <Stack marginBottom={1}>
          <Typography level="h3" component="h2">
            {title}
          </Typography>
        </Stack>
      }
    >
      <DataTable
        data={data}
        columns={slowestAndFastestTasksColumns}
        sorting={{
          manualSorting: false,
        }}
        rowNavigation={{
          route: (row) =>
            resolveProcedureDetailsRoute({
              businessModule: businessModuleName as ApiBusinessModule,
              procedureId: row.original.id,
              status: ApiProcedureStatus.Closed,
            }),
          focusColumnAccessorKey: "createdAt",
        }}
      />
    </TableSheet>
  );
}
