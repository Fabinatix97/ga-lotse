/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AnalysisApi,
  Configuration,
  DataExportApi,
  DataSourceApi,
  EvaluationApi,
  EvaluationTemplateApi,
  FilterTemplateApi,
  GeoShapeApi,
  ReportApi,
  ReportSeriesApi,
  StatisticsCentralRepositoryApi,
  StatisticsFeatureTogglesApi,
} from "@eshg/employee-portal-api/statistics";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const params = useApiConfiguration("PUBLIC_STATISTICS_BACKEND_URL");
  return new Configuration(params);
}

export function useEvaluationTemplateApi() {
  const configuration = useConfiguration();
  return new EvaluationTemplateApi(configuration);
}

export function useEvaluationApi() {
  const configuration = useConfiguration();
  return new EvaluationApi(configuration);
}

export function useDataSourceApi() {
  const configuration = useConfiguration();
  return new DataSourceApi(configuration);
}

export function useAnalysisApi() {
  const configuration = useConfiguration();
  return new AnalysisApi(configuration);
}

export function useDataExportApi() {
  const config = useConfiguration();
  return new DataExportApi(config);
}

export function useGeoShapeApi() {
  const configuration = useConfiguration();
  return new GeoShapeApi(configuration);
}

export function useFilterTemplateApi() {
  const configuration = useConfiguration();
  return new FilterTemplateApi(configuration);
}

export function useFeatureTogglesApi() {
  const configuration = useConfiguration();
  return new StatisticsFeatureTogglesApi(configuration);
}

export function useReportSeriesApi() {
  const configuration = useConfiguration();
  return new ReportSeriesApi(configuration);
}

export function useReportApi() {
  const configuration = useConfiguration();
  return new ReportApi(configuration);
}

export function useCentralRepositoryApi() {
  const configuration = useConfiguration();
  return new StatisticsCentralRepositoryApi(configuration);
}
