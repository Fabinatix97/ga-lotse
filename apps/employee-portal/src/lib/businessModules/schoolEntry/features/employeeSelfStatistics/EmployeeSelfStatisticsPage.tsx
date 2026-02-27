/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Day,
  eachWeekOfInterval,
  endOfWeek,
  getISOWeek,
  getISOWeekYear,
  isSameWeek,
  startOfWeek,
} from "date-fns";
import { startTransition, useState } from "react";
import { sumBy } from "remeda";

import {
  ContentPanel,
  ContentPanelTitle,
  DataTable,
  TableSheet,
  TimeRangeSelect,
  lastXMonthsInDate,
} from "@eshg/lib-employee-portal";
import { ApiWeeklyDataBin } from "@eshg/school-entry-api";

import { useGetEmployeeSelfStatisticsQuery } from "@/lib/businessModules/schoolEntry/api/queries/employeeSelfStatistics";

const columnHelper = createColumnHelper<ApiWeeklyDataBin>();

const shortDateFormatter = Intl.DateTimeFormat("de-DE", {
  month: "long",
  day: "numeric",
});

const dateFormatter = Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatRange(date: Date) {
  return `${shortDateFormatter.format(date)} - ${shortDateFormatter.format(endOfWeek(date, { weekStartsOn: 1 }))}`;
}

const columns = [
  columnHelper.accessor((data) => getISOWeekYear(data.lowerBound), {
    header: "Jahr",
    enableSorting: false,
    meta: {
      width: 150,
    },
  }),
  columnHelper.accessor((data) => getISOWeek(data.lowerBound), {
    header: "KW",
    enableSorting: false,
    meta: {
      width: 150,
    },
  }),
  columnHelper.accessor((data) => formatRange(data.lowerBound), {
    header: "Zeitraum (Montag - Sonntag)",
    enableSorting: false,
    meta: {
      width: 250,
    },
  }),
  columnHelper.accessor((data) => data.count, {
    header: "Anzahl Untersuchungen",
    enableSorting: false,
    meta: {
      textAlign: "right",
    },
  }),
];

const dateFnsOptions = {
  weekStartsOn: 1 as Day,
};

export function EmployeeSelfStatisticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState(1);

  const timeRangeEnd = endOfWeek(new Date(), dateFnsOptions);
  const timeRangeStart = startOfWeek(
    lastXMonthsInDate(timeRangeEnd, selectedTimeRange),
    dateFnsOptions,
  );

  const weeks = eachWeekOfInterval(
    {
      start: timeRangeStart,
      end: timeRangeEnd,
    },
    dateFnsOptions,
  );

  const { data: rawData } = useGetEmployeeSelfStatisticsQuery({
    timeRangeStart: timeRangeStart,
    timeRangeEnd,
  });

  let i = 0;
  const data = weeks.map((week) => {
    if (rawData[i] && isSameWeek(rawData[i]!.lowerBound, week)) {
      return rawData[i++]!;
    } else {
      return {
        lowerBound: week,
        count: 0,
      };
    }
  });

  if (i !== rawData.length) {
    throw new Error("There is unused data from the backend!");
  }

  const total = sumBy(rawData, (entry) => entry.count);

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
      <Stack
        flexWrap="wrap"
        alignItems="flex-start"
        gap={2}
        sx={{
          flexDirection: { md: "row" },
        }}
      >
        <TableSheet>
          <DataTable
            data={data}
            columns={columns}
            sorting={{
              manualSorting: false,
            }}
            minWidth={700}
          />
        </TableSheet>
        <ContentPanel
          dense
          role="region"
          ariaLabel="Gesamtzahl der Untersuchungen"
        >
          <ContentPanelTitle component="h2">
            Gesamtzahl der Untersuchungen
          </ContentPanelTitle>
          <Stack
            gap={2}
            minWidth="22rem"
            sx={(theme) => ({
              backgroundColor: theme.palette.background.level1,
              borderRadius: theme.radius.md,
              padding: theme.spacing(2),
            })}
          >
            <Stack spacing={1} direction="row">
              <Typography>Zeitraum:</Typography>
              <Typography fontWeight={600}>
                {dateFormatter.format(timeRangeStart)} bis{" "}
                {dateFormatter.format(timeRangeEnd)}
              </Typography>
            </Stack>
            <Stack spacing={1} direction="row">
              <Typography>Untersuchungen:</Typography>
              <Typography fontWeight={600}>{total}</Typography>
            </Stack>
          </Stack>
        </ContentPanel>
      </Stack>
    </Stack>
  );
}
