/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatUserName } from "@eshg/lib-portal/formatters/person";
import {
  ApiAnalysis,
  ApiAnalysisChartConfiguration,
  ApiAttributeSelection,
  ApiGetDetailPageInformationResponse,
  EvaluationApi,
} from "@eshg/statistics-api";
import { queryOptions } from "@tanstack/react-query";

import { mapAttributeSelectionToKey } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { mapDataSourceSensitivityApiToFrontend } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import {
  Analysis,
  AnalysisDiagramConfiguration,
  DiagramColorScheme,
  DiagramType,
  EvaluationDetailsView,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  FlatAttribute,
  mapTableColumnHeadersToFlatAttributes,
} from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { evaluationApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";

function mapConfiguration(
  attributes: Map<string, FlatAttribute>,
  diagramConfiguration: ApiAnalysisChartConfiguration,
): AnalysisDiagramConfiguration {
  function getApiAttribute(
    selectionKey: ApiAttributeSelection | undefined,
  ): FlatAttribute | undefined {
    if (!selectionKey) {
      return undefined;
    }
    return attributes.get(mapAttributeSelectionToKey(selectionKey))!;
  }

  switch (diagramConfiguration.type) {
    case "BarChartConfiguration":
      return {
        type: DiagramType.BAR_CHART,
        grouping: diagramConfiguration.grouping,
        orientation: diagramConfiguration.orientation,
        scaling: diagramConfiguration.scaling,
        primaryAttribute: getApiAttribute(
          diagramConfiguration.primaryAttribute,
        )!,
        secondaryAttribute: getApiAttribute(
          diagramConfiguration.secondaryAttribute,
        ),
      };
    case "HistogramChartConfiguration":
      return {
        type: DiagramType.HISTOGRAM_CHART,
        grouping: diagramConfiguration.grouping,
        scaling: diagramConfiguration.scaling,
        binning: diagramConfiguration.binningMode,
        bins: diagramConfiguration.numberOfBins,
        minBin: diagramConfiguration.minBin,
        maxBin: diagramConfiguration.maxBin,
        primaryAttribute: getApiAttribute(
          diagramConfiguration.primaryAttribute,
        )!,
        secondaryAttribute: getApiAttribute(
          diagramConfiguration.secondaryAttribute,
        ),
      };
    case "ScatterChartConfiguration":
      return {
        type: DiagramType.SCATTER_CHART,
        trendline: diagramConfiguration.trendLine,
        axisRange: diagramConfiguration.range,
        xAttribute: getApiAttribute(diagramConfiguration.xAttribute)!,
        yAttribute: getApiAttribute(diagramConfiguration.yAttribute)!,
        secondaryAttribute: getApiAttribute(
          diagramConfiguration.secondaryAttribute,
        ),
      };
    case "LineChartConfiguration":
      return {
        type: DiagramType.LINE_CHART,
        axisRange: diagramConfiguration.range,
        xAttribute: getApiAttribute(diagramConfiguration.xAttribute)!,
        yAttribute: getApiAttribute(diagramConfiguration.yAttribute)!,
        secondaryAttribute: getApiAttribute(
          diagramConfiguration.secondaryAttribute,
        ),
      };
    case "PieChartConfiguration":
      return {
        type: DiagramType.PIE_CHART,
        attribute: getApiAttribute(diagramConfiguration.attribute)!,
      };
    case "ChoroplethMapConfiguration":
      return {
        type: DiagramType.CHOROPLETH_CHART,
        geoReferencedAttribute: getApiAttribute(
          diagramConfiguration.primaryAttribute,
        )!,
        secondaryAttribute: getApiAttribute(
          diagramConfiguration.secondaryAttribute,
        ),
        colorScheme: diagramConfiguration.colorScheme as DiagramColorScheme,
        characteristicParameter: diagramConfiguration.calculation,
      };
  }
}

export function mapAnalyses(
  analyses: ApiAnalysis[],
  attributes: FlatAttribute[],
): Analysis[] {
  const attributeMap = new Map<string, FlatAttribute>();
  attributes.forEach((it) => attributeMap.set(it.key, it));
  return analyses.map((it) => ({
    id: it.id,
    name: it.name,
    numberOfDiagrams: it.numberOfDiagrams,
    createdAt: it.createdAt,
    diagramConfiguration: mapConfiguration(attributeMap, it.chartConfiguration),
  }));
}

export function mapToEvaluationDetailsView(
  result: ApiGetDetailPageInformationResponse,
) {
  const attributes: FlatAttribute[] = mapTableColumnHeadersToFlatAttributes(
    result.tableColumnHeaders,
  );
  return {
    evaluationId: result.evaluationInfo.id,
    title: result.evaluationInfo.name,
    start: result.evaluationInfo.timeRangeStart,
    end: mapTimeRangeEndApiToFrontend(result.evaluationInfo.timeRangeEnd),
    createdAt: result.evaluationInfo.createdAt,
    createdBy: formatUserName(result.user),
    dataSource: {
      // We only have one datasource currently. If this changes the data structure changes and thus
      // this aggregation method has to become more sophisticated.
      name: result.tableColumnHeaders[0]!.dataSourceName,
      module: mapToApiBusinessModule(
        result.tableColumnHeaders[0]!.businessModule,
      ),
      attributeLabels: attributes.map((it) => it.name),
      datasetAmount: result.totalNumberOfElements,
      sensitivity: mapDataSourceSensitivityApiToFrontend(
        result.evaluationInfo.dataSensitivity,
      ),
    },
    attributes: attributes,
    analyses: mapAnalyses(result.analyses, attributes),
    userId: result.user?.userId,
    tooMuchDataForExport: result.evaluationInfo.tooMuchDataForExport,
  } satisfies EvaluationDetailsView;
}

export function createQueryGetDetailPageInformation(
  evaluationApi: EvaluationApi,
  evaluationId: string,
) {
  return queryOptions({
    queryKey: evaluationApiQueryKey(["getDetailPageInformation", evaluationId]),
    queryFn: () => evaluationApi.getDetailPageInformation(evaluationId),
    select: mapToEvaluationDetailsView,
  });
}
