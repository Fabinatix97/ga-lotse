/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/base";
import {
  ApiBinningMode,
  ApiCalculation,
  ApiGrouping,
  ApiOrientation,
  ApiRange,
  ApiScaling,
} from "@eshg/employee-portal-api/statistics";

import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export enum DiagramType {
  BAR_CHART = "BAR_CHART",
  PIE_CHART = "PIE_CHART",
  SCATTER_CHART = "SCATTER_CHART",
  HISTOGRAM_CHART = "HISTOGRAM_CHART",
  LINE_CHART = "LINE_CHART",
  CHOROPLETH_CHART = "CHOROPLETH_CHART",
}

export type DiagramOrientation = ApiOrientation;
export type DiagramGrouping = ApiGrouping;
export type DiagramScaling = ApiScaling;
export type DiagramAxisRange = ApiRange;
export type DiagramBinning = ApiBinningMode;
export type DiagramCharacteristicParameter = ApiCalculation;
export type DiagramColorScheme = "UNIFORM" | "GREEN2BLUE" | "BLUE2GREEN";

export interface EvaluationDetailsView {
  evaluationId: string;
  title: string;
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy: string;
  dataSource: {
    name: string;
    module: ApiBusinessModule;
    datasetAmount: number;
    attributeLabels: string[];
    sensitivity: DataSourceSensitivity;
  };
  analyses: Analysis[];
  attributes: FlatAttribute[];
  userId: string | undefined;
  tooMuchDataForExport: boolean;
}

export interface Diagram<T> {
  diagramId: string;
  title: string;
  description: string | undefined;
  evaluatedDataAmount: number;
  filterLabels: string[];
  data: T[];
}

export interface ChoroplethDiagram<T> extends Diagram<T> {
  geoJson: string;
}

export type AnalysisDiagram =
  | AnalysisDiagramBarChart
  | AnalysisDiagramHistogram
  | AnalysisDiagramLineChart
  | AnalysisDiagramScatterChart
  | AnalysisDiagramPieChart
  | AnalysisDiagramChoroplethMap;

export type AnalysisDiagramBarChart = Diagram<{
  label: string;
  attributes: {
    label: string;
    value: number;
  }[];
}>;

export type AnalysisDiagramHistogram = Diagram<{
  min: number;
  max: number;
  attributes: {
    label: string;
    value: number;
  }[];
}>;

export type AnalysisDiagramLineChart = Diagram<{
  label: string;
  dataPoints: {
    x: number;
    y: number;
  }[];
}> & { isReducedResolution: boolean };

export type AnalysisDiagramScatterChart = Diagram<{
  label: string;
  dataPoints: {
    x: number;
    y: number;
  }[];
  trendline?: {
    offset: number;
    slope: number;
  };
}> & { isReducedResolution: boolean };

export type AnalysisDiagramPieChart = Diagram<{
  label: string;
  value: number;
}>;

export type AnalysisDiagramChoroplethMap = ChoroplethDiagram<{
  name: string;
  value: number | undefined;
}>;

export interface Analysis {
  id: string;
  name: string;
  createdAt: Date;
  numberOfDiagrams: number;
  diagramConfiguration: AnalysisDiagramConfiguration;
}

export type AnalysisDiagramConfiguration =
  | AnalysisBarDiagramConfiguration
  | AnalysisHistogramDiagramConfiguration
  | AnalysisLineDiagramConfiguration
  | AnalysisScatterDiagramConfiguration
  | AnalysisPieDiagramConfiguration
  | AnalysisChoroplethDiagramConfiguration;

export interface AnalysisBarDiagramConfiguration {
  type: DiagramType.BAR_CHART;
  primaryAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  scaling?: DiagramScaling;
  grouping?: DiagramGrouping;
  orientation: DiagramOrientation;
}

export interface AnalysisHistogramDiagramConfiguration {
  type: DiagramType.HISTOGRAM_CHART;
  primaryAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  scaling?: DiagramScaling;
  grouping?: DiagramGrouping;
  binning: DiagramBinning;
  bins?: number;
}

export interface AnalysisLineDiagramConfiguration {
  type: DiagramType.LINE_CHART;
  xAttribute: FlatAttribute;
  yAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  axisRange: DiagramAxisRange;
}

export interface AnalysisScatterDiagramConfiguration {
  type: DiagramType.SCATTER_CHART;
  xAttribute: FlatAttribute;
  yAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  axisRange: DiagramAxisRange;
  trendline: boolean;
}

export interface AnalysisPieDiagramConfiguration {
  type: DiagramType.PIE_CHART;
  attribute: FlatAttribute;
}

export interface AnalysisChoroplethDiagramConfiguration {
  type: DiagramType.CHOROPLETH_CHART;
  geoReferencedAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  colorScheme: DiagramColorScheme;
  characteristicParameter?: DiagramCharacteristicParameter;
}
