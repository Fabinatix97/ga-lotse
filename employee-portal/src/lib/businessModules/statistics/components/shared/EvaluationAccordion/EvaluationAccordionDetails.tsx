/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  DiagramType,
  Evaluation,
  EvaluationBarDiagramConfiguration,
  EvaluationDiagramConfiguration,
  EvaluationHistogramDiagramConfiguration,
  EvaluationLineDiagramConfiguration,
  EvaluationScatterDiagramConfiguration,
} from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { useGetEvaluation } from "@/lib/businessModules/statistics/api/queries/useGetEvaluation";
import { EvaluationChartDiagram } from "@/lib/businessModules/statistics/components/shared/EvaluationAccordion/EvaluationChartDiagram";
import {
  axisRangeValueNames,
  colorSchemeNames,
  diagramTypeNames,
  getChoroplethAggregationMethod,
  groupingValueNames,
  orientationValueNames,
  scalingValueNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";

export interface EvaluationAccordionDetailsProps {
  evaluation: Evaluation;
  attributes: FlatAttribute[];
  evaluatedDataAmountTotal: number;
  onDiagramCreateClicked?: (evaluationId: string) => void;
  isReport: boolean;
}

export function EvaluationAccordionDetails(
  props: EvaluationAccordionDetailsProps,
) {
  const evaluationDiagrams = useGetEvaluation(
    props.evaluation.id,
    props.attributes,
  );
  const canWrite = useStatisticRoleChecks().canWrite();
  const canCreateDiagram = isNonNullish(props.onDiagramCreateClicked);

  function handleDiagramCreateClick() {
    if (isNonNullish(props.onDiagramCreateClicked)) {
      props.onDiagramCreateClicked(props.evaluation.id);
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
              value={formatDate(props.evaluation.createdAt)}
            />
            <LabelValuePair
              label="Diagrammtyp"
              value={
                diagramTypeNames[props.evaluation.diagramConfiguration.type]
              }
            />
            <DiagramConfigurationValues
              diagramConfiguration={props.evaluation.diagramConfiguration}
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
        {evaluationDiagrams.map((it) => (
          <Stack
            key={it.diagramId}
            sx={{ minWidth: "31rem" }}
            flexGrow={1}
            flexBasis={"30%"}
          >
            <EvaluationChartDiagram
              configuration={props.evaluation.diagramConfiguration}
              evaluationDiagram={it}
              evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
              isReport={props.isReport}
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
    | EvaluationBarDiagramConfiguration
    | EvaluationHistogramDiagramConfiguration,
): LabelValueTuple[] {
  return [
    ["Primäres Attribut", diagramConfiguration.primaryAttribute.name],
    ["Sekundäres Attribut", diagramConfiguration.secondaryAttribute?.name],
  ];
}

function barAndHistogramConfigurationValues(
  diagramConfiguration:
    | EvaluationBarDiagramConfiguration
    | EvaluationHistogramDiagramConfiguration,
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
    | EvaluationLineDiagramConfiguration
    | EvaluationScatterDiagramConfiguration,
): LabelValueTuple[] {
  return [
    ["X-Achse", diagramConfiguration.xAttribute.name],
    ["Y-Achse", diagramConfiguration.yAttribute.name],
    ["Sekundäres Attribut", diagramConfiguration.secondaryAttribute?.name],
    ["Achsenskalierung", axisRangeValueNames[diagramConfiguration.axisRange]],
  ];
}

function getDiagramConfigurationValues(
  diagramConfiguration: EvaluationDiagramConfiguration,
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
  diagramConfiguration: EvaluationDiagramConfiguration;
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
