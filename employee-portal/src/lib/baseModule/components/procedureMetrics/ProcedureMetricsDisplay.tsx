/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedureMetric } from "@eshg/employee-portal-api/inspection";
import {
  CheckOutlined,
  DeviceHubOutlined,
  EditOutlined,
  OpenInNewOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { unique } from "remeda";

import { FlashCard } from "@/lib/shared/components/cards/FlashCard";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

import { TimeRangeSelect } from "./TimeRangeSelect";
import { columnName, initialSorting, procedureMetricsColumns } from "./columns";

export function ProcedureMetricsDisplay(props: {
  procedureMetrics: ApiProcedureMetric[];
  selectedTimeRange: number;
  setSelectedTimeRange: (value: number) => void;
}) {
  function sumProcedureCounts(
    givenType: keyof Pick<
      ApiProcedureMetric,
      | "totalCount"
      | "abortedCount"
      | "closedCount"
      | "inProgressCount"
      | "openOrDraftCount"
    >,
  ) {
    return props.procedureMetrics
      .map((type) => type[givenType])
      .reduce((a, b) => a + b, 0);
  }

  const uniqueBusinessModules = unique(
    props.procedureMetrics.map((item) => item.businessModule),
  );

  return (
    <Stack gap={3}>
      <TimeRangeSelect
        optionsInMonths={[1, 3, 6, 12]}
        selectedTimeRange={props.selectedTimeRange}
        setSelectedTimeRange={props.setSelectedTimeRange}
      />
      <Stack role="list" direction="row" flexWrap="wrap" gap={2}>
        <FlashCard
          color={"background"}
          title={columnName.totalCount}
          figure={`${sumProcedureCounts("totalCount")}`}
          icon={<DeviceHubOutlined fontSize="xl4" />}
        />
        <FlashCard
          color={"warning"}
          title={columnName.openOrDraftCount}
          figure={`${sumProcedureCounts("openOrDraftCount")}`}
          icon={<OpenInNewOutlined fontSize="xl4" />}
        />
        <FlashCard
          color={"primary"}
          title={columnName.inProgressCount}
          figure={`${sumProcedureCounts("inProgressCount")}`}
          icon={<EditOutlined fontSize="xl4" />}
        />
        <FlashCard
          color={"danger"}
          title={columnName.abortedCount}
          figure={`${sumProcedureCounts("abortedCount")}`}
          icon={<WarningAmberOutlined fontSize="xl4" />}
        />
        <FlashCard
          color={"success"}
          title={columnName.closedCount}
          figure={`${sumProcedureCounts("closedCount")}`}
          icon={<CheckOutlined fontSize="xl4" />}
        />
      </Stack>
      <Stack gap={5}>
        {uniqueBusinessModules.map((businessModule) => (
          <Stack key={businessModuleNames[businessModule]} gap={2}>
            <Typography
              level={"body-lg"}
              key={businessModuleNames[businessModule]}
            >
              {businessModuleNames[businessModule]}
            </Typography>
            <TableSheet>
              <DataTable
                data={props.procedureMetrics.filter(
                  (procedure) => procedure.businessModule === businessModule,
                )}
                columns={procedureMetricsColumns}
                sorting={{
                  manualSorting: false,
                  initialSorting,
                }}
              />
            </TableSheet>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
