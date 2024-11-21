/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAnalysisChartConfiguration,
  ApiAnalysisWithDiagrams,
  ApiDiagramDiagramData,
  ApiValueWithOptionsAttribute,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isNonNullish } from "remeda";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { getActiveFilterLabels } from "@/lib/businessModules/statistics/api/mapper/getActiveFilterLabels";
import { mapAttributeSelectionToKey } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { mapAttributesToFilterDefinitions } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToFilterDefinitions";
import { mapStatisticFilterToFilterValue } from "@/lib/businessModules/statistics/api/mapper/mapStatisticFilterToFilterValue";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { EvaluationDiagram } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { evaluationApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";

interface ConfigurationAttributeKeys {
  primaryAttribute?: string;
  secondaryAttribute?: string;
}

interface ConfigurationAttributes {
  primaryAttribute?: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
}

function mapConfigurationToAttributeKeys(
  chartConfiguration: ApiAnalysisChartConfiguration,
): ConfigurationAttributeKeys {
  switch (chartConfiguration.type) {
    case "BarChartConfiguration":
    case "ChoroplethMapConfiguration":
    case "HistogramChartConfiguration":
      return {
        primaryAttribute: mapAttributeSelectionToKey(
          chartConfiguration.primaryAttribute,
        ),
        secondaryAttribute: isNonNullish(chartConfiguration.secondaryAttribute)
          ? mapAttributeSelectionToKey(chartConfiguration.secondaryAttribute)
          : undefined,
      };
    case "PieChartConfiguration":
      return {
        primaryAttribute: mapAttributeSelectionToKey(
          chartConfiguration.attribute,
        ),
      };
    case "LineChartConfiguration":
    case "ScatterChartConfiguration":
      return {
        secondaryAttribute: isNonNullish(chartConfiguration.secondaryAttribute)
          ? mapAttributeSelectionToKey(chartConfiguration.secondaryAttribute)
          : undefined,
      };
  }
}

function getAttributeFromKey(attributes: FlatAttribute[], key?: string) {
  return isNonNullish(key)
    ? attributes.find((attributes) => attributes.key === key)
    : undefined;
}

function getConfigurationAttributesFromKeys(
  configurationAttributeKeys: ConfigurationAttributeKeys,
  attributes: FlatAttribute[],
): ConfigurationAttributes {
  return {
    primaryAttribute: getAttributeFromKey(
      attributes,
      configurationAttributeKeys.primaryAttribute,
    ),
    secondaryAttribute: getAttributeFromKey(
      attributes,
      configurationAttributeKeys.secondaryAttribute,
    ),
  };
}

function getValueOptionFromKey(
  key: string,
  attribute: ApiValueWithOptionsAttribute,
) {
  return (
    attribute.valueOptions.find((option) => option.value === key)?.meaning ??
    key
  );
}

function getLabelForCategoricalAttribute(
  key: string,
  configurationAttribute?: FlatAttribute,
) {
  if (isNonNullish(configurationAttribute)) {
    return configurationAttribute.type == "ValueWithOptionsAttribute"
      ? getValueOptionFromKey(key, configurationAttribute)
      : key;
    //In the case of "BooleanAttribute" the key already is the correct label
  } else return key;
}

function mapDiagramData(
  diagramData: ApiDiagramDiagramData,
  attributes: FlatAttribute[],
  chartConfiguration: ApiAnalysisChartConfiguration,
): EvaluationDiagram["data"] {
  const configurationAttributeKeys =
    mapConfigurationToAttributeKeys(chartConfiguration);
  const configurationAttributes = getConfigurationAttributesFromKeys(
    configurationAttributeKeys,
    attributes,
  );
  switch (diagramData.type) {
    case "BarChartData":
      return diagramData.barChartGroupDatas.map((it) => ({
        label: getLabelForCategoricalAttribute(
          it.key,
          configurationAttributes.primaryAttribute,
        ),
        attributes: it.keyToCounts.map((ktc) => ({
          label: isNonNullish(configurationAttributes.secondaryAttribute)
            ? getLabelForCategoricalAttribute(
                ktc.key,
                configurationAttributes.secondaryAttribute,
              )
            : getLabelForCategoricalAttribute(
                ktc.key,
                configurationAttributes.primaryAttribute,
              ),
          value: ktc.count,
        })),
      }));
    case "PieChartData":
      return diagramData.keyToCounts.map((it) => ({
        label: getLabelForCategoricalAttribute(
          it.key,
          configurationAttributes.primaryAttribute,
        ),
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
        attributes: it.keyToCounts.map((it) => ({
          label: getLabelForCategoricalAttribute(
            it.key,
            configurationAttributes.secondaryAttribute,
          ),
          value: it.count,
        })),
      }));
    case "ChoroplethMapData":
      return diagramData.keyToValues.map((it) => ({
        name: it.key,
        value: it.value,
      }));
    case "ScatterChartDataCategorized":
      return diagramData.dataPointGroups.map((it) => ({
        label: getLabelForCategoricalAttribute(
          it.key,
          configurationAttributes.secondaryAttribute,
        ),
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
        label: getLabelForCategoricalAttribute(
          it.key,
          configurationAttributes.secondaryAttribute,
        ),
        dataPoints: it.dataPoints,
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
  result: ApiAnalysisWithDiagrams,
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
      data: mapDiagramData(
        it.diagramData,
        attributes,
        result.chartConfiguration,
      ),
    } as EvaluationDiagram;
  });
}

export function useGetAnalysis(
  analysisId: string,
  attributes: FlatAttribute[],
) {
  const evaluationApi = useEvaluationApi();

  const queryResult = useSuspenseQuery({
    queryKey: evaluationApiQueryKey(["getAnalysis", analysisId]),
    queryFn: () => evaluationApi.getAnalysis(analysisId),
    select: (result) => mapToEvaluationDiagram(result, attributes),
  });
  return queryResult.data;
}
