/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseFeatureTogglesApi,
  CalendarApi,
  CalendarEventApi,
  Configuration,
  ContactApi,
  DepartmentApi,
  FacilityApi,
  GdprProcedureApi,
  InventoryApi,
  LabelApi,
  NotificationAggregationApi,
  PersonApi,
  ProcedureAggregationApi,
  PublicConfigApi,
  ResourceApi,
  StreetApi,
  TaskAggregationApi,
  TaskMetricsApi,
  UserApi,
} from "@eshg/employee-portal-api/base";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_BASE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useBaseFeatureTogglesApi() {
  const configuration = useConfiguration();
  return new BaseFeatureTogglesApi(configuration);
}

export function useStreetApi() {
  const configuration = useConfiguration();
  return new StreetApi(configuration);
}

export function useContactApi() {
  const configuration = useConfiguration();
  return new ContactApi(configuration);
}

export function usePersonApi() {
  const configuration = useConfiguration();
  return new PersonApi(configuration);
}

export function useFacilityApi() {
  const configuration = useConfiguration();
  return new FacilityApi(configuration);
}

export function useLabelApi() {
  const configuration = useConfiguration();
  return new LabelApi(configuration);
}

export function useInventoryApi() {
  const configuration = useConfiguration();
  return new InventoryApi(configuration);
}

export function useGdprProcedureApi() {
  const configuration = useConfiguration();
  return new GdprProcedureApi(configuration);
}

export function useResourceApi() {
  const configuration = useConfiguration();
  return new ResourceApi(configuration);
}

export function useCalendarApi() {
  const configuration = useConfiguration();
  return new CalendarApi(configuration);
}

export function useCalendarEventApi() {
  const configuration = useConfiguration();
  return new CalendarEventApi(configuration);
}

export function useTaskAggregationApi() {
  const configuration = useConfiguration();
  return new TaskAggregationApi(configuration);
}

export function useUserApi() {
  const configuration = useConfiguration();
  return new UserApi(configuration);
}

export function useProcedureAggregationApi() {
  const configuration = useConfiguration();
  return new ProcedureAggregationApi(configuration);
}

export function useTaskMetricsApi() {
  const configuration = useConfiguration();
  return new TaskMetricsApi(configuration);
}

export function useNotificationAggregationApi() {
  const configuration = useConfiguration();
  return new NotificationAggregationApi(configuration);
}

export function useDepartmentApi() {
  const configuration = useConfiguration();
  return new DepartmentApi(configuration);
}

export function useConfigApi() {
  const configuration = useConfiguration();
  return new PublicConfigApi(configuration);
}
