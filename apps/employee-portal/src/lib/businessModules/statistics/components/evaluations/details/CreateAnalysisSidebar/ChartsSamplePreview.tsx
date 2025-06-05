/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isNumber } from "remeda";

import { OptionalFieldValue } from "@eshg/lib-portal";

export function ChartsSamplePreview({ chart }: { chart: ReactNode }) {
  return (
    <Stack gap={3}>
      <Typography level="h3" component="h2">
        Vorschau
      </Typography>
      <Sheet
        variant="soft"
        color="neutral"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: (theme) => theme.radius.sm,
          padding: 2,
        }}
      >
        {chart}
      </Sheet>
    </Stack>
  );
}

export const barChartSimpleSampleData = [
  {
    label: "A",
    attributes: [
      {
        label: "A",
        value: 8,
      },
    ],
  },
  {
    label: "B",
    attributes: [
      {
        label: "B",
        value: 7,
      },
    ],
  },
  {
    label: "C",
    attributes: [
      {
        label: "C",
        value: 10,
      },
    ],
  },
  {
    label: "D",
    attributes: [
      {
        label: "D",
        value: 5,
      },
    ],
  },
];

export const barChartGroupedSampleData = [
  {
    label: "A",
    attributes: [
      {
        label: "a",
        value: 7,
      },
      {
        label: "b",
        value: 8,
      },
    ],
  },
  {
    label: "B",
    attributes: [
      {
        label: "a",
        value: 5,
      },
      {
        label: "b",
        value: 7,
      },
    ],
  },
  {
    label: "C",
    attributes: [
      {
        label: "a",
        value: 3,
      },
      {
        label: "b",
        value: 10,
      },
    ],
  },
  {
    label: "D",
    attributes: [
      {
        label: "a",
        value: 1,
      },
      {
        label: "b",
        value: 5,
      },
    ],
  },
];

export function getHistogramSampleData(
  isGrouped: boolean,
  bins: number,
  minBinCenter: OptionalFieldValue<number>,
  maxBinCenter: OptionalFieldValue<number>,
) {
  const DEFAULT_INTERVAL = 1;
  const DEFAULT_MIN = 0;

  const hasMinMax =
    isNumber(minBinCenter) &&
    isNumber(maxBinCenter) &&
    minBinCenter < maxBinCenter;
  const interval = hasMinMax
    ? (maxBinCenter - minBinCenter) / (bins - 1)
    : DEFAULT_INTERVAL;
  const min = hasMinMax ? minBinCenter - interval / 2 : DEFAULT_MIN;

  const histogramData = [];
  for (let i = 0; i < bins; i++) {
    histogramData.push({
      min: i * interval + min,
      max: (i + 1) * interval + min,
      attributes: [
        {
          label: "A",
          value: 5 + i,
        },
        ...(isGrouped
          ? [
              {
                label: "B",
                value: 8,
              },
              {
                label: "C",
                value: 3,
              },
              {
                label: "D",
                value: 15 - 0.5 * i,
              },
            ]
          : []),
      ],
    });
  }
  return histogramData;
}

export const pieChartSampleData = [
  {
    label: "A",
    value: 5,
  },
  {
    label: "B",
    value: 8,
  },
  {
    label: "C",
    value: 3,
  },
  {
    label: "D",
    value: 6,
  },
  {
    label: "E",
    value: 1,
  },
];

export const lineChartSimpleSampleData = [
  {
    label: "Gruppe 1",
    dataPoints: [
      { x: 11, y: 11 },
      { x: 22, y: 9.5 },
      { x: 34, y: 12 },
      { x: 46, y: 11 },
      { x: 58, y: 14 },
    ],
  },
];

export const lineChartGroupedSampleData = [
  ...lineChartSimpleSampleData,
  {
    label: "Gruppe 2",
    dataPoints: [
      { x: 12.5, y: 8 },
      { x: 20, y: 12 },
      { x: 30, y: 13 },
      { x: 45, y: 18 },
    ],
  },
];

export function getScatterChartSimpleSampleData(hasTrendline: boolean) {
  return [
    {
      label: "Gruppe 1",
      dataPoints: [
        { x: 14.2, y: 215 },
        { x: 16.4, y: 325 },
        { x: 11.9, y: 185 },
        { x: 15.2, y: 332 },
        { x: 18.5, y: 406 },
        { x: 22.1, y: 522 },
        { x: 19.4, y: 412 },
        { x: 25.1, y: 614 },
        { x: 23.4, y: 544 },
        { x: 18.1, y: 421 },
        { x: 22.6, y: 445 },
        { x: 17.2, y: 408 },
      ],
      trendline: hasTrendline
        ? {
            offset: -216,
            slope: 33,
          }
        : undefined,
    },
  ];
}

export function getScatterChartGroupedSampleData(hasTrendline: boolean) {
  return [
    ...getScatterChartSimpleSampleData(hasTrendline),
    {
      label: "Gruppe 2",
      dataPoints: [
        { x: 10, y: 500 },
        { x: 15, y: 250 },
        { x: 20, y: 400 },
        { x: 25, y: 250 },
        { x: 30, y: 300 },
        { x: 35, y: 300 },
      ],
      trendline: hasTrendline
        ? {
            offset: 461.9,
            slope: -5.714,
          }
        : undefined,
    },
  ];
}

export const chartSampleConfiguration = {
  xAttribute: {
    name: "A",
    unit: "m",
  },
  yAttribute: {
    name: "B",
    unit: "kg",
  },
};

export const choroplethLandArea = [
  {
    name: "Afrika",
    value: 30_365_000,
  },
  {
    name: "Asien",
    value: 44_614_000,
  },
  {
    name: "Australien",
    value: 8_510_926,
  },
  {
    name: "Südamerika",
    value: 17_814_000,
  },
  {
    name: "Europa",
    value: 10_000_000,
  },
  {
    name: "Nordamerika",
    value: 24_230_000,
  },
];

export const choroplethCountryCount = [
  {
    name: "Afrika",
    value: 54,
  },
  {
    name: "Asien",
    value: 47,
  },
  {
    name: "Australien",
    value: 14,
  },
  {
    name: "Südamerika",
    value: 12,
  },
  {
    name: "Europa",
    value: 43,
  },
  {
    name: "Nordamerika",
    value: 23,
  },
];

export const choroplethAverageLandArea = choroplethLandArea.map((sum) => ({
  name: sum.name,
  value: parseFloat(
    (
      sum.value /
      choroplethCountryCount.find((simple) => simple.name === sum.name)!.value
    ).toFixed(2),
  ),
}));
