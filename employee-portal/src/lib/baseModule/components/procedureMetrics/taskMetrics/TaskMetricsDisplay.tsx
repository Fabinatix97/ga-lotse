/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedureType } from "@eshg/employee-portal-api/base";
import {
  CheckOutlined,
  HourglassEmptyOutlined,
  RocketLaunchOutlined,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { endOfToday } from "date-fns";
import { startTransition, useState } from "react";

import { useTaskMetricsQuery } from "@/lib/baseModule/api/queries/taskMetrics";
import { TimeRangeSelect } from "@/lib/baseModule/components/procedureMetrics/TimeRangeSelect";
import { lastXMonthsInDate } from "@/lib/baseModule/components/procedureMetrics/rangeSelectHelper";
import { FlashCard } from "@/lib/shared/components/cards/FlashCard";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

import { formatOptionalDuration } from "./formatOptionalDuration";
import { slowestAndFastestTasksColumns } from "./slowestAndFastestColumns";
import { tasksColumns } from "./taskColumns";

export function TaskMetricsDisplay(props: {
  businessModuleName: string;
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
          color={"primary"}
          title="Geschlossene Vorgänge"
          figure={`${taskMetrics.closedProcedureCount}`}
          icon={<CheckOutlined fontSize="xl4" />}
        />
        <FlashCard
          color={"danger"}
          title="Langsamster Vorgang"
          figure={`${formatOptionalDuration(taskMetrics.slowestProcedures[0]?.duration)}`}
          icon={<HourglassEmptyOutlined fontSize="xl4" />}
        />
        <FlashCard
          color={"success"}
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

        <TableSheet
          title={
            <Stack marginBottom={1}>
              <Typography level="h3" component="h2">
                Schnellste Vorgänge
              </Typography>
            </Stack>
          }
        >
          <DataTable
            data={taskMetrics.fastestProcedures}
            columns={slowestAndFastestTasksColumns}
            sorting={{
              manualSorting: false,
            }}
          />
        </TableSheet>

        <TableSheet
          title={
            <Stack marginBottom={1}>
              <Typography level="h3" component="h2">
                Langsamste Vorgänge
              </Typography>
            </Stack>
          }
        >
          <DataTable
            data={taskMetrics.slowestProcedures}
            columns={slowestAndFastestTasksColumns}
            sorting={{
              manualSorting: false,
            }}
          />
        </TableSheet>
      </Stack>
    </Stack>
  );
}
