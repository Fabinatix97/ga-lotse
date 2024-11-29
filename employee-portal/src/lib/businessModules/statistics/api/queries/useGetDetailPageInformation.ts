/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAnalysis,
  ApiAnalysisChartConfiguration,
  ApiAttributeSelection,
  ApiGetDetailPageInformationResponse,
  EvaluationApi,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { mapAttributeSelectionToKey } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
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
import { fullName } from "@/lib/shared/components/users/userFormatter";

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
    createdBy: fullName(result.user),
    dataSource: {
      // We only have one datasource currently. If this changes the data structure changes and thus
      // this aggregation method has to become more sophisticated.
      name: result.tableColumnHeaders[0]!.dataSourceName,
      module: mapToApiBusinessModule(
        result.tableColumnHeaders[0]!.businessModule,
      ),
      attributeLabels: attributes.map((it) => it.name),
      datasetAmount: result.totalNumberOfElements,
    },
    attributes: attributes,
    analyses: mapAnalyses(result.analyses, attributes),
    userId: result.user!.userId,
    anonymized: result.evaluationInfo.anonymized,
  } satisfies EvaluationDetailsView;
}

export function createQueryGetDetailPageInformation(
  evaluationApi: EvaluationApi,
  evaluationId: string,
) {
  return {
    queryKey: evaluationApiQueryKey(["getDetailPageInformation", evaluationId]),
    queryFn: () => evaluationApi.getDetailPageInformation(evaluationId),
    select: mapToEvaluationDetailsView,
  };
}

export function useGetDetailPageInformation(evaluationId: string) {
  const evaluationApi = useEvaluationApi();
  const queryResult = useSuspenseQuery(
    createQueryGetDetailPageInformation(evaluationApi, evaluationId),
  );
  return queryResult.data;
}
