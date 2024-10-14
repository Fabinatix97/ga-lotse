/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  DataExportApi,
  DataSourceApi,
  EvaluationApi,
  EvaluationTemplateApi,
  FilterTemplateApi,
  GeoShapeApi,
  ReportApi,
  ReportSeriesApi,
  StatisticApi,
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

export function useStatisticApi() {
  const configuration = useConfiguration();
  return new StatisticApi(configuration);
}

export function useDataSourceApi() {
  const configuration = useConfiguration();
  return new DataSourceApi(configuration);
}

export function useEvaluationApi() {
  const configuration = useConfiguration();
  return new EvaluationApi(configuration);
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
