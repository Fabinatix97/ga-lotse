/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import {
  Analysis,
  AnalysisBarDiagramConfiguration,
  AnalysisDiagramConfiguration,
  AnalysisHistogramDiagramConfiguration,
  AnalysisLineDiagramConfiguration,
  AnalysisScatterDiagramConfiguration,
  DiagramType,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { useGetAnalysis } from "@/lib/businessModules/statistics/api/queries/useGetAnalysis";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticsRoleChecks";
import { AnalysisChartDiagram } from "@/lib/businessModules/statistics/components/shared/AnalysisAccordion/AnalysisChartDiagram";
import {
  axisRangeValueNames,
  colorSchemeNames,
  diagramTypeNames,
  getChoroplethAggregationMethod,
  groupingValueNames,
  orientationValueNames,
  scalingValueNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";

export interface AnalysisAccordionDetailsProps {
  analysis: Analysis;
  attributes: FlatAttribute[];
  evaluatedDataAmountTotal: number;
  onDiagramCreateClicked?: (analysisId: string) => void;
  isReport: boolean;
  anonymized: boolean;
}

export function AnalysisAccordionDetails(props: AnalysisAccordionDetailsProps) {
  const analysisDiagrams = useGetAnalysis(props.analysis.id, props.attributes);
  const canWrite = useStatisticsRoleChecks().canWrite();
  const canCreateDiagram = isNonNullish(props.onDiagramCreateClicked);

  function handleDiagramCreateClick() {
    if (isNonNullish(props.onDiagramCreateClicked)) {
      props.onDiagramCreateClicked(props.analysis.id);
    }
  }

  return (
    <Stack spacing={4} flex={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        flexWrap="wrap"
        spacing={1}
      >
        <Stack spacing={2} width="30rem">
          <Typography level="title-md">Analysedetails</Typography>
          <Stack spacing={1}>
            <LabelValuePair
              label="Erstellungsdatum"
              value={formatDate(props.analysis.createdAt)}
            />
            <LabelValuePair
              label="Diagrammtyp"
              value={diagramTypeNames[props.analysis.diagramConfiguration.type]}
            />
            <DiagramConfigurationValues
              diagramConfiguration={props.analysis.diagramConfiguration}
            />
          </Stack>
        </Stack>
        {canWrite && canCreateDiagram && (
          <Button
            startDecorator={<Add />}
            onClick={handleDiagramCreateClick}
            data-testid="upper-add-diagram-button"
          >
            Diagramm hinzufügen
          </Button>
        )}
      </Stack>
      <Divider />
      <Stack gap={2} direction={"row"} flexWrap={"wrap"}>
        {analysisDiagrams.map((it) => (
          <Stack
            key={it.diagramId}
            sx={{ minWidth: "31rem" }}
            flexGrow={1}
            flexBasis={"30%"}
          >
            <AnalysisChartDiagram
              configuration={props.analysis.diagramConfiguration}
              analysisDiagram={it}
              evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
              isReport={props.isReport}
              anonymized={props.anonymized}
            />
          </Stack>
        ))}
      </Stack>
      {canWrite && canCreateDiagram && (
        <Button
          variant="plain"
          startDecorator={<Add />}
          sx={{ alignSelf: "flex-end" }}
          onClick={handleDiagramCreateClick}
          data-testid="lower-add-diagram-button"
        >
          Diagramm hinzufügen
        </Button>
      )}
    </Stack>
  );
}

type LabelValueTuple = [label: string, value: string | undefined];

function barAndHistogramAttributeValues(
  diagramConfiguration:
    | AnalysisBarDiagramConfiguration
    | AnalysisHistogramDiagramConfiguration,
): LabelValueTuple[] {
  return [
    ["Primäres Attribut", diagramConfiguration.primaryAttribute.name],
    ["Sekundäres Attribut", diagramConfiguration.secondaryAttribute?.name],
  ];
}

function barAndHistogramConfigurationValues(
  diagramConfiguration:
    | AnalysisBarDiagramConfiguration
    | AnalysisHistogramDiagramConfiguration,
): LabelValueTuple[] {
  return [
    [
      "Anordnung",
      diagramConfiguration.grouping &&
        groupingValueNames[diagramConfiguration.grouping],
    ],
    [
      "Verhältnisse",
      diagramConfiguration.scaling &&
        scalingValueNames[diagramConfiguration.scaling],
    ],
  ];
}

function lineAndScatterValues(
  diagramConfiguration:
    | AnalysisLineDiagramConfiguration
    | AnalysisScatterDiagramConfiguration,
): LabelValueTuple[] {
  return [
    ["X-Achse", diagramConfiguration.xAttribute.name],
    ["Y-Achse", diagramConfiguration.yAttribute.name],
    ["Sekundäres Attribut", diagramConfiguration.secondaryAttribute?.name],
    ["Achsenskalierung", axisRangeValueNames[diagramConfiguration.axisRange]],
  ];
}

function getDiagramConfigurationValues(
  diagramConfiguration: AnalysisDiagramConfiguration,
): LabelValueTuple[] {
  switch (diagramConfiguration.type) {
    case DiagramType.BAR_CHART:
      return [
        ...barAndHistogramAttributeValues(diagramConfiguration),
        [
          "Ausrichtung",
          orientationValueNames[diagramConfiguration.orientation],
        ],
        ...barAndHistogramConfigurationValues(diagramConfiguration),
      ];
    case DiagramType.HISTOGRAM_CHART:
      return [
        ...barAndHistogramAttributeValues(diagramConfiguration),
        ...barAndHistogramConfigurationValues(diagramConfiguration),
        [
          "Bins",
          isNonNullish(diagramConfiguration.bins)
            ? String(diagramConfiguration.bins)
            : "Auto",
        ],
      ];
    case DiagramType.LINE_CHART:
      return lineAndScatterValues(diagramConfiguration);
    case DiagramType.SCATTER_CHART:
      return [
        ...lineAndScatterValues(diagramConfiguration),
        ["Trendgerade", diagramConfiguration.trendline ? "Ja" : "Nein"],
      ];
    case DiagramType.PIE_CHART:
      return [["Attribut", diagramConfiguration.attribute.name]];
    case DiagramType.CHOROPLETH_CHART:
      return [
        [
          "Georeferenziertes Attribut",
          diagramConfiguration.geoReferencedAttribute.name,
        ],
        ["Sekundäres Attribut", diagramConfiguration.secondaryAttribute?.name],
        ["Farbschema", colorSchemeNames[diagramConfiguration.colorScheme]],
        [
          "Darstellung",
          getChoroplethAggregationMethod(
            diagramConfiguration.characteristicParameter,
          ),
        ],
      ];
  }
}

interface DiagramConfigurationValuesProps {
  diagramConfiguration: AnalysisDiagramConfiguration;
}

function DiagramConfigurationValues(props: DiagramConfigurationValuesProps) {
  const labelValueTuples = getDiagramConfigurationValues(
    props.diagramConfiguration,
  );

  return labelValueTuples.map(([label, value]) => {
    return isNonNullish(value) ? (
      <LabelValuePair key={label} label={label} value={value} />
    ) : null;
  });
}
