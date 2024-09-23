/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDiagramDiagramData,
  ApiEvaluationWithDiagrams,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { getActiveFilterLabels } from "@/lib/businessModules/statistics/api/mapper/getActiveFilterLabels";
import { mapAttributesToFilterDefinitions } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToFilterDefinitions";
import { mapStatisticFilterToFilterValue } from "@/lib/businessModules/statistics/api/mapper/mapStatisticFilterToFilterValue";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { EvaluationDiagram } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { evaluationApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";

function mapDiagramData(
  diagramData: ApiDiagramDiagramData,
): EvaluationDiagram["data"] {
  switch (diagramData.type) {
    case "BarChartData":
      return diagramData.barChartGroupDatas.map((it) => ({
        label: it.key,
        attributes: it.keyToCounts.map((ktc) => ({
          label: ktc.key,
          value: ktc.count,
        })),
      }));
    case "PieChartData":
      return diagramData.keyToCounts.map((it) => ({
        label: it.key,
        value: it.count,
      }));
    case "HistogramChartDataSimple":
      return diagramData.histogramGroupDatas.map((it) => ({
        min: it.histogramBin.lowerBound,
        max: it.histogramBin.upperBound,
        attributes: [
          {
            label: "",
            value: it.count,
          },
        ],
      }));
    case "HistogramChartDataCategorized":
      return diagramData.histogramGroupDatas.map((it) => ({
        min: it.histogramBin.lowerBound,
        max: it.histogramBin.upperBound,
        attributes: it.keyToCounts.map((iIt) => ({
          label: iIt.key,
          value: iIt.count,
        })),
      }));
    case "ChoroplethMapData":
      return diagramData.keyToValues.map((it) => ({
        name: it.key,
        value: it.value,
      }));
    case "ScatterChartDataCategorized":
      return diagramData.dataPointGroups.map((it) => ({
        label: it.key,
        dataPoints: it.dataPoints,
        trendline: it.trendLine,
      }));
    case "ScatterChartDataSimple":
      return [
        {
          label: "",
          dataPoints: diagramData.dataPoints,
          trendline: diagramData.trendLine,
        },
      ];
    case "LineChartDataCategorized":
      return diagramData.dataPointGroups.map((it) => ({
        label: it.key,
        dataPoints: it.dataPoints,
        // trendline: it.trendLine,
      }));
    case "LineChartDataSimple":
      return [
        {
          label: "",
          dataPoints: diagramData.dataPoints,
        },
      ];
  }
}

export function mapToEvaluationDiagram(
  result: ApiEvaluationWithDiagrams,
  attributes: FlatAttribute[],
) {
  const filterDefinitions = mapAttributesToFilterDefinitions(attributes);

  return result.diagrams.map((it) => {
    const filterValues = it.filters?.map((flt) =>
      mapStatisticFilterToFilterValue(flt),
    );
    return {
      diagramId: it.id,
      title: it.title,
      description: it.description,
      evaluatedDataAmount: it.evaluatedDataAmount,
      filterLabels: getActiveFilterLabels(filterValues, filterDefinitions),
      geoJson:
        result.chartConfiguration.type === "ChoroplethMapConfiguration"
          ? result.chartConfiguration.geoJson!
          : undefined,
      data: mapDiagramData(it.diagramData),
    } as EvaluationDiagram;
  });
}

export function useGetEvaluation(
  evaluationId: string,
  attributes: FlatAttribute[],
) {
  const evaluationApi = useEvaluationApi();

  const queryResult = useSuspenseQuery({
    queryKey: evaluationApiQueryKey(["getEvaluation", evaluationId]),
    queryFn: () => evaluationApi.getEvaluation(evaluationId),
    select: (result) => mapToEvaluationDiagram(result, attributes),
  });
  return queryResult.data;
}
