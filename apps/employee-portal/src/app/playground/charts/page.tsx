/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Option, Select, Sheet, Stack, Switch, Typography } from "@mui/joy";
import { MapSeriesOption } from "echarts";
import { ReactNode, useState } from "react";

import { MainContentLayout } from "@eshg/lib-employee-portal";

import {
  DiagramAxisRange,
  DiagramCharacteristicParameter,
  DiagramColorScheme,
  DiagramGrouping,
  DiagramOrientation,
  DiagramScaling,
  DiagramType,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { choroplethCountryCount } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ChartsSamplePreview";
import { continentsGeoJSON } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/worldContinentsGeoJSON";
import { AnalysisDiagramBox } from "@/lib/businessModules/statistics/components/shared/AnalysisAccordion/AnalysisDiagramBox";
import { BarChart } from "@/lib/businessModules/statistics/components/shared/charts/BarChart";
import { ChoroplethMap } from "@/lib/businessModules/statistics/components/shared/charts/ChoroplethMap";
import { Histogram } from "@/lib/businessModules/statistics/components/shared/charts/Histogram";
import { LineChart } from "@/lib/businessModules/statistics/components/shared/charts/LineChart";
import { PieChart } from "@/lib/businessModules/statistics/components/shared/charts/PieChart";
import { ScatterChart } from "@/lib/businessModules/statistics/components/shared/charts/ScatterChart";

function PlaygroundChartBox({
  title,
  chart,
  switches,
}: {
  title: string;
  chart: ReactNode;
  switches?: ReactNode[];
}) {
  return (
    <Sheet>
      <Stack gap={2}>
        <Typography level="h4">{title}</Typography>
        <AnalysisDiagramBox
          evaluatedDataAmountTotal={100}
          description="Hier könnte Ihre Werbung stehen"
          filterLabels={["Label 1", "Label 2"]}
          evaluatedDataAmount={42}
          getChart={() => chart}
        />
        <Stack direction="row" gap={3}>
          {switches}
        </Stack>
      </Stack>
    </Sheet>
  );
}

export default function PlaygroundChartsPage() {
  const [orientation, setOrientation] =
    useState<DiagramOrientation>("VERTICAL");
  const [grouping, setGrouping] = useState<DiagramGrouping>("GROUPED");
  const [scaling, setScaling] = useState<DiagramScaling>("ABSOLUTE");
  const [axisRange, setAxisRange] = useState<DiagramAxisRange>("ADAPTED");
  const [trendLine, setTrendLine] = useState(false);
  const [colorScheme, setColorScheme] = useState<DiagramColorScheme>("UNIFORM");
  const [characteristicParameter, setCharacteristicParameter] = useState<
    DiagramCharacteristicParameter | undefined
  >();
  const [aspectScale, setAspectScale] = useState(false);

  const orientationSwitch = (
    <Typography
      key="orientationSwitch"
      component="label"
      endDecorator={
        <Switch
          checked={orientation === "HORIZONTAL"}
          onChange={(event) =>
            setOrientation(event.target.checked ? "HORIZONTAL" : "VERTICAL")
          }
        />
      }
    >
      Ausrichtung
    </Typography>
  );

  const groupingSwitch = (
    <Typography
      key="groupingSwitch"
      component="label"
      endDecorator={
        <Switch
          checked={grouping === "STACKED"}
          onChange={(event) =>
            setGrouping(event.target.checked ? "STACKED" : "GROUPED")
          }
        />
      }
    >
      Anordnung
    </Typography>
  );

  const scalingSwitch = (
    <Typography
      key="scalingSwitch"
      component="label"
      endDecorator={
        <Switch
          checked={scaling === "RELATIVE"}
          onChange={(event) =>
            setScaling(event.target.checked ? "RELATIVE" : "ABSOLUTE")
          }
        />
      }
    >
      Verhältnisse
    </Typography>
  );

  const axisRangeSwitch = (
    <Typography
      key="axisRangeSwitch"
      component="label"
      endDecorator={
        <Switch
          checked={axisRange === "ORIGIN"}
          onChange={(event) =>
            setAxisRange(event.target.checked ? "ORIGIN" : "ADAPTED")
          }
        />
      }
    >
      Achsenskalierung
    </Typography>
  );

  const trendLineSwitch = (
    <Typography
      key="trendLineSwitch"
      component="label"
      endDecorator={
        <Switch
          checked={trendLine}
          onChange={(event) => setTrendLine(event.target.checked)}
        />
      }
    >
      Trendlinie
    </Typography>
  );

  const colorSchemeSelect = (
    <Typography
      key="colorSchemeSelect"
      component="label"
      endDecorator={
        <Select
          value={colorScheme}
          onChange={(_, value) => setColorScheme(value!)}
        >
          <Option value="UNIFORM">Uniform</Option>
          <Option value="GREEN2BLUE">Grün zu blau</Option>
          <Option value="BLUE2GREEN">Blau zu grün</Option>
        </Select>
      }
    >
      Farbschema
    </Typography>
  );

  const characteristicParameterSelect = (
    <Typography
      key="characteristicParameterSelect"
      component="label"
      endDecorator={
        <Select
          value={characteristicParameter ?? null}
          onChange={(_, value) =>
            value === null
              ? setCharacteristicParameter(undefined)
              : setCharacteristicParameter(value)
          }
        >
          <Option value="MEAN"> Mittelwert</Option>
          <Option value="SUM"> Summe</Option>
          <Option value={null}> Häufigkeit</Option>
        </Select>
      }
    >
      Darstellung
    </Typography>
  );

  const aspectScaleSwitch = (
    <Typography
      component="label"
      endDecorator={
        <Switch
          checked={aspectScale}
          startDecorator={<p>0.75 (default)</p>}
          endDecorator={<p>1</p>}
          onChange={(event) => setAspectScale(event.target.checked)}
        />
      }
    >
      Aspect Scale
    </Typography>
  );

  const barChartSimple = [
    {
      label: "Hund",
      attributes: [
        {
          label: "Hund",
          value: 5,
        },
      ],
    },
    {
      label: "Katze",
      attributes: [
        {
          label: "Katze",
          value: 8,
        },
      ],
    },
    {
      label: "Schwein",
      attributes: [
        {
          label: "Schwein",
          value: 3,
        },
      ],
    },
    {
      label: "Schildkröte",
      attributes: [
        {
          label: "Schildkröte",
          value: 6,
        },
      ],
    },
    {
      label: "Leguan",
      attributes: [
        {
          label: "Leguan",
          value: 1,
        },
      ],
    },
  ];

  const barChartSimpleWithNegativeValues = [
    {
      label: "Hund",
      attributes: [
        {
          label: "Hund",
          value: 5,
        },
      ],
    },
    {
      label: "Katze",
      attributes: [
        {
          label: "Katze",
          value: 0,
        },
      ],
    },
    {
      label: "Schwein",
      attributes: [
        {
          label: "Schwein",
          value: 3,
        },
      ],
    },
    {
      label: "Schildkröte",
      attributes: [
        {
          label: "Schildkröte",
          value: -6,
        },
      ],
    },
    {
      label: "Leguan",
      attributes: [
        {
          label: "Leguan",
          value: 1,
        },
      ],
    },
  ];

  const barChartGrouped = [
    {
      label: "Wild",
      attributes: [
        {
          label: "Hund",
          value: 5,
        },
        {
          label: "Katze",
          value: 8,
        },
        {
          label: "Schwein",
          value: 3,
        },
        {
          label: "Schildkröte",
          value: 15,
        },
      ],
    },
    {
      label: "Domestiziert",
      attributes: [
        {
          label: "Hund",
          value: 20,
        },
        {
          label: "Katze",
          value: 10,
        },
        {
          label: "Schwein",
          value: 2,
        },
        {
          label: "Schildkröte",
          value: 7,
        },
      ],
    },
  ];

  const barChartGroupedWithNegativeValues = [
    {
      label: "Wild",
      attributes: [
        {
          label: "Hund",
          value: 5,
        },
        {
          label: "Katze",
          value: 8,
        },
        {
          label: "Schwein",
          value: 3,
        },
        {
          label: "Schildkröte",
          value: -15,
        },
      ],
    },
    {
      label: "Domestiziert",
      attributes: [
        {
          label: "Hund",
          value: 20,
        },
        {
          label: "Katze",
          value: 0,
        },
        {
          label: "Schwein",
          value: 2,
        },
        {
          label: "Schildkröte",
          value: 7,
        },
      ],
    },
  ];

  const barChartGroupedWithOnlyOneGroup = [
    {
      label: "Wild",
      attributes: [
        {
          label: "Hund",
          value: 5,
        },
      ],
    },
    {
      label: "Domestiziert",
      attributes: [
        {
          label: "Hund",
          value: 20,
        },
      ],
    },
  ];

  const barChartMuchData = [];
  for (let i = 0; i < 50; i++) {
    barChartMuchData.push({
      label: i.toString(),
      attributes: [
        {
          label: "Hund",
          value: 5 + 0.1 * i,
        },
        {
          label: "Katze",
          value: 8,
        },
        {
          label: "Schwein",
          value: 3,
        },
        {
          label: "Schildkröte",
          value: 6,
        },
      ],
    });
  }

  const barChartLongLabels = [
    {
      label:
        "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : A",
      attributes: [
        {
          label:
            "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : A",
          value: 5,
        },
      ],
    },
    {
      label:
        "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : B",
      attributes: [
        {
          label:
            "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : B",
          value: 8,
        },
      ],
    },
    {
      label:
        "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : C",
      attributes: [
        {
          label:
            "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : C",
          value: 3,
        },
      ],
    },
    {
      label:
        "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : D",
      attributes: [
        {
          label:
            "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : D",
          value: 6,
        },
      ],
    },
  ];

  const barChartManyLongSecondaryAttributes = [];
  const attributes = [];
  for (let i = 0; i < 20; i++) {
    attributes.push({
      label:
        "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : " +
        i,
      value: i,
    });
  }
  for (let i = 0; i < 4; i++) {
    barChartManyLongSecondaryAttributes.push({
      label: i.toString(),
      attributes,
    });
  }

  const pieChartSimple = [
    {
      label: "Hund",
      value: 5,
    },
    {
      label: "Katze",
      value: 8,
    },
    {
      label: "Schwein",
      value: 3,
    },
    {
      label: "Schildkröte",
      value: 6,
    },
    {
      label: "Leguan",
      value: 1,
    },
  ];

  const pieChartManyLongValues = [];
  for (let i = 0; i < 100; i++) {
    pieChartManyLongValues.push({
      label:
        "Sehr lange Bezeichnung für den Bezirk mit der wundervollen Nummer:  " +
        i,
      value: 1,
    });
  }

  const pieChartLargeAndSmallValues = [
    {
      label: "Mehrheit",
      value: 10000,
    },
  ];
  for (let i = 0; i < 10; i++) {
    pieChartLargeAndSmallValues.push({
      label: "Minderheit Nr " + i,
      value: 1,
    });
  }

  const pieChartWithNegativeValue = [
    {
      label: "Hund",
      value: 5,
    },
    {
      label: "Katze",
      value: 0,
    },
    {
      label: "Schwein",
      value: 3,
    },
    {
      label: "Schildkröte",
      value: -6,
    },
    {
      label: "Leguan",
      value: 1,
    },
  ];

  const histogramSimple = [];
  for (let i = 0; i < 10; i++) {
    histogramSimple.push({
      min: 0.1 * i - 0.5,
      max: 0.1 * i - 0.4,
      attributes: [
        {
          label: "Hund",
          value: 5 + i,
        },
      ],
    });
  }

  const histogramGrouped = [];
  for (let i = 0; i < 10; i++) {
    histogramGrouped.push({
      min: i,
      max: i + 1,
      attributes: [
        {
          label: "Hund",
          value: 5 + i,
        },
        {
          label: "Katze",
          value: 8,
        },
        {
          label: "Schwein",
          value: 3,
        },
        {
          label: "Schildkröte",
          value: 15 - 0.5 * i,
        },
      ],
    });
  }

  const histogramWithNegativeValues = [];
  for (let i = 0; i < 10; i++) {
    histogramWithNegativeValues.push({
      min: i,
      max: i + 1,
      attributes: [
        {
          label: "Hund",
          value: 5 - i,
        },
        {
          label: "Katze",
          value: 8,
        },
        {
          label: "Schwein",
          value: 3,
        },
        {
          label: "Schildkröte",
          value: 15 - 0.5 * i,
        },
      ],
    });
  }

  const histogramWithManyValues = [];
  for (let i = 0; i < 50; i++) {
    histogramWithManyValues.push({
      min: i,
      max: i + 1,
      attributes: [
        {
          label: "Hund",
          value: 5 + 0.1 * i,
        },
      ],
    });
  }

  const lineChartSimple = [
    {
      label: "Gruppe 1",
      dataPoints: [
        { x: 1, y: 10 },
        { x: 1, y: 1 },
        { x: 2, y: 7 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 6, y: -2 },
        { x: 8, y: 2 },
      ],
    },
  ];

  const lineChartSimpleConfiguration = {
    axisRange: axisRange,
    type: DiagramType.LINE_CHART,
    secondaryAttribute: undefined,
    xAttribute: {
      type: "IntegerAttribute",
      name: "Größe",
      unit: "m",
    },
    yAttribute: {
      type: "IntegerAttribute",
      name: "Gewicht",
      unit: "kg",
    },
  };

  const lineChartGroupedWithLongValues = [
    {
      label:
        "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : A",
      dataPoints: [
        { x: 1, y: 10 },
        { x: 1, y: 1 },
        { x: 2, y: 7 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 6, y: -2 },
        { x: 8, y: 2 },
      ],
    },
    {
      label:
        "Sehr lange Bezeichnung für einen einfachen Attributen der den meisten Leuten bekannt ist unter : B",
      dataPoints: [
        { x: -5, y: 1 },
        { x: 10, y: 12 },
        { x: 0, y: 6 },
        { x: 20, y: 8 },
      ],
    },
  ];

  const lineChartConfigurationWithLongAxisNames = {
    axisRange: axisRange,
    type: DiagramType.LINE_CHART,
    secondaryAttribute: undefined,
    xAttribute: {
      type: "IntegerAttribute",
      name: "Die ganz besondere Einheit der gemessen Substanz gerundet nach Gefühl und Flexibilität",
      unit: "Einheitskürzel",
    },
    yAttribute: {
      type: "IntegerAttribute",
      name: "Die ganz besondere Einheit der gemessen Substanz gerundet nach Gefühl und Flexibilität",
      unit: "Einheitskürzel",
    },
  };

  const scatterChartSimple = [
    {
      label: "Gruppe 1",
      dataPoints: [
        { x: 1, y: 10 },
        { x: 1, y: 1 },
        { x: 2, y: 7 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 6, y: 8 },
        { x: 8, y: 2 },
      ],
      trendline: {
        offset: 3.8071065989847717,
        slope: 0.08629441624365483,
      },
    },
  ];

  const scatterChartLargeAndSmallValues = [
    {
      label: "Gruppe 1",
      dataPoints: [
        { x: 1, y: 1000 },
        { x: 1, y: 1 },
        { x: 2, y: 7 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 6, y: 8 },
        { x: 8, y: 2 },
      ],
      trendline: {
        offset: 3.8071065989847717,
        slope: 0.08629441624365483,
      },
    },
    {
      label: "Gruppe 2",
      dataPoints: [
        { x: 10, y: 1 },
        { x: 30, y: 12 },
        { x: 50, y: 6 },
        { x: 70, y: 8 },
        { x: 90, y: 3 },
      ],
      trendline: {
        offset: 6,
        slope: 0,
      },
    },
  ];

  const scatterChartConfig = {
    trendline: trendLine,
    axisRange: axisRange,
    type: DiagramType.SCATTER_CHART,
    secondaryAttribute: undefined,
    xAttribute: {
      type: "IntegerAttribute",
      name: "Größe",
      unit: "m",
    },
    yAttribute: {
      type: "IntegerAttribute",
      name: "Gewicht",
      unit: "kg",
    },
  };

  return (
    <MainContentLayout>
      <Stack gap={3}>
        <PlaygroundChartBox
          title="Balkendiagramm simpel"
          chart={
            <BarChart
              diagramData={barChartSimple}
              isDataGrouped={false}
              orientation={orientation}
            />
          }
          switches={[orientationSwitch]}
        />
        <PlaygroundChartBox
          title="Balkendiagramm simpel mit negativen Werten"
          chart={
            <BarChart
              diagramData={barChartSimpleWithNegativeValues}
              isDataGrouped={false}
              orientation={orientation}
            />
          }
          switches={[orientationSwitch]}
        />
        <PlaygroundChartBox
          title="Balkendiagramm gruppiert"
          chart={
            <BarChart
              diagramData={barChartGrouped}
              isDataGrouped
              orientation={orientation}
              grouping={grouping}
              scaling={scaling}
            />
          }
          switches={[orientationSwitch, groupingSwitch, scalingSwitch]}
        />
        <PlaygroundChartBox
          title="Balkendiagramm gruppiert mit negativen Werten"
          chart={
            <BarChart
              diagramData={barChartGroupedWithNegativeValues}
              isDataGrouped
              orientation={orientation}
              grouping={grouping}
              scaling={scaling}
            />
          }
          switches={[orientationSwitch, groupingSwitch, scalingSwitch]}
        />
        <PlaygroundChartBox
          title="Balkendiagramm gruppiert mit nur einer Gruppe"
          chart={
            <BarChart
              diagramData={barChartGroupedWithOnlyOneGroup}
              isDataGrouped
              orientation={orientation}
              grouping={grouping}
              scaling={scaling}
            />
          }
          switches={[orientationSwitch, groupingSwitch, scalingSwitch]}
        />
        <PlaygroundChartBox
          title="Balkendiagramm mit vielen Werten"
          chart={
            <BarChart
              diagramData={barChartMuchData}
              isDataGrouped
              orientation={orientation}
              grouping={grouping}
              scaling={scaling}
            />
          }
          switches={[orientationSwitch, groupingSwitch, scalingSwitch]}
        />
        <PlaygroundChartBox
          title="Balkendiagramm mit langen Bezeichnern"
          chart={
            <BarChart
              diagramData={barChartLongLabels}
              isDataGrouped={false}
              orientation={orientation}
            />
          }
          switches={[orientationSwitch]}
        />
        <PlaygroundChartBox
          title="Balkendiagramm mit vielen langen sekundären Attributen"
          chart={
            <BarChart
              diagramData={barChartManyLongSecondaryAttributes}
              isDataGrouped
              orientation={orientation}
              grouping={grouping}
              scaling={scaling}
            />
          }
          switches={[orientationSwitch, groupingSwitch, scalingSwitch]}
        />
        <PlaygroundChartBox
          title="Kreisdiagram simpel"
          chart={<PieChart diagramData={pieChartSimple} />}
        />
        <PlaygroundChartBox
          title="Kreisdiagram mit vielen Werten und langen Bezeichnern"
          chart={<PieChart diagramData={pieChartManyLongValues} />}
        />
        <PlaygroundChartBox
          title="Kreisdiagram mit sehr großen und kleinen Werten"
          chart={<PieChart diagramData={pieChartLargeAndSmallValues} />}
        />
        <PlaygroundChartBox
          title="Kreisdiagram mit negativem Wert"
          chart={<PieChart diagramData={pieChartWithNegativeValue} />}
        />
        <PlaygroundChartBox
          title="Histogramm simpel"
          chart={
            <Histogram diagramData={histogramSimple} isDataGrouped={false} />
          }
        />
        <PlaygroundChartBox
          title="Histogramm gruppiert"
          chart={
            <Histogram
              diagramData={histogramGrouped}
              isDataGrouped
              grouping={grouping}
              scaling={scaling}
            />
          }
          switches={[groupingSwitch, scalingSwitch]}
        />
        <PlaygroundChartBox
          title="Histogramm mit negativen Werten"
          chart={
            <Histogram
              diagramData={histogramWithNegativeValues}
              isDataGrouped
              grouping={grouping}
              scaling={scaling}
            />
          }
          switches={[groupingSwitch, scalingSwitch]}
        />
        <PlaygroundChartBox
          title="Histogramm gruppiert mit nur einer Gruppe"
          chart={
            <Histogram
              diagramData={histogramSimple}
              isDataGrouped
              grouping={grouping}
              scaling={scaling}
            />
          }
          switches={[groupingSwitch, scalingSwitch]}
        />
        <PlaygroundChartBox
          title="Histogramm mit vielen Werten"
          chart={
            <Histogram
              isDataGrouped={false}
              diagramData={histogramWithManyValues}
            />
          }
        />
        <PlaygroundChartBox
          title="Liniendiagramm simpel"
          chart={
            <LineChart
              diagramData={lineChartSimple}
              configuration={lineChartSimpleConfiguration}
            />
          }
          switches={[axisRangeSwitch]}
        />
        <PlaygroundChartBox
          title="Liniendiagramm gruppiert mit langen Attributnamen und Achsentiteln"
          chart={
            <LineChart
              diagramData={lineChartGroupedWithLongValues}
              configuration={lineChartConfigurationWithLongAxisNames}
            />
          }
          switches={[axisRangeSwitch]}
        />
        <PlaygroundChartBox
          title="Streudiagramm simpel"
          chart={
            <ScatterChart
              diagramData={scatterChartSimple}
              configuration={scatterChartConfig}
            />
          }
          switches={[axisRangeSwitch, trendLineSwitch]}
        />
        <PlaygroundChartBox
          title="Streudiagramm mit Werten die weit auseinander sind"
          chart={
            <ScatterChart
              diagramData={scatterChartLargeAndSmallValues}
              configuration={scatterChartConfig}
            />
          }
          switches={[axisRangeSwitch, trendLineSwitch]}
        />
        <PlaygroundChartBox
          title="Choroplethenkarte"
          chart={
            <ChoroplethMap
              key={`${aspectScale}`}
              diagramData={choroplethCountryCount}
              colorScheme={colorScheme}
              characteristicParameter={characteristicParameter}
              geoJson={continentsGeoJSON}
              additionalEchartsSeriesOptions={
                aspectScale
                  ? ({
                      aspectScale: 1,
                    } as MapSeriesOption)
                  : undefined
              }
            />
          }
          switches={[
            colorSchemeSelect,
            characteristicParameterSelect,
            aspectScaleSwitch,
          ]}
        />
      </Stack>
    </MainContentLayout>
  );
}
