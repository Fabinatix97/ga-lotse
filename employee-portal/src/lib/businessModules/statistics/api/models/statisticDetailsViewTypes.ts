/**
 * Copyright 2024 cronn GmbH
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

export interface StatisticDetailsView {
  statisticId: string;
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
  };
  evaluations: Evaluation[];
  attributes: FlatAttribute[];
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

export type EvaluationDiagram =
  | EvaluationDiagramBarChart
  | EvaluationDiagramHistogram
  | EvaluationDiagramLineChart
  | EvaluationDiagramScatterChart
  | EvaluationDiagramPieChart
  | EvaluationDiagramChoroplethMap;

export type EvaluationDiagramBarChart = Diagram<{
  label: string;
  attributes: {
    label: string;
    value: number;
  }[];
}>;

export type EvaluationDiagramHistogram = Diagram<{
  min: number;
  max: number;
  attributes: {
    label: string;
    value: number;
  }[];
}>;

export type EvaluationDiagramLineChart = Diagram<{
  label: string;
  dataPoints: {
    x: number;
    y: number;
  }[];
}> & { isReducedResolution: boolean };

export type EvaluationDiagramScatterChart = Diagram<{
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

export type EvaluationDiagramPieChart = Diagram<{
  label: string;
  value: number;
}>;

export type EvaluationDiagramChoroplethMap = ChoroplethDiagram<{
  name: string;
  value: number | undefined;
}>;

export interface Evaluation {
  id: string;
  name: string;
  createdAt: Date;
  numberOfDiagrams: number;
  diagramConfiguration: EvaluationDiagramConfiguration;
}

export type EvaluationDiagramConfiguration =
  | EvaluationBarDiagramConfiguration
  | EvaluationHistogramDiagramConfiguration
  | EvaluationLineDiagramConfiguration
  | EvaluationScatterDiagramConfiguration
  | EvaluationPieDiagramConfiguration
  | EvaluationChoroplethDiagramConfiguration;

export interface EvaluationBarDiagramConfiguration {
  type: DiagramType.BAR_CHART;
  primaryAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  scaling?: DiagramScaling;
  grouping?: DiagramGrouping;
  orientation: DiagramOrientation;
}

export interface EvaluationHistogramDiagramConfiguration {
  type: DiagramType.HISTOGRAM_CHART;
  primaryAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  scaling?: DiagramScaling;
  grouping?: DiagramGrouping;
  binning: DiagramBinning;
  bins?: number;
}

export interface EvaluationLineDiagramConfiguration {
  type: DiagramType.LINE_CHART;
  xAttribute: FlatAttribute;
  yAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  axisRange: DiagramAxisRange;
}

export interface EvaluationScatterDiagramConfiguration {
  type: DiagramType.SCATTER_CHART;
  xAttribute: FlatAttribute;
  yAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  axisRange: DiagramAxisRange;
  trendline: boolean;
}

export interface EvaluationPieDiagramConfiguration {
  type: DiagramType.PIE_CHART;
  attribute: FlatAttribute;
}

export interface EvaluationChoroplethDiagramConfiguration {
  type: DiagramType.CHOROPLETH_CHART;
  geoReferencedAttribute: FlatAttribute;
  secondaryAttribute?: FlatAttribute;
  colorScheme: DiagramColorScheme;
  characteristicParameter?: DiagramCharacteristicParameter;
}
