/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AppointmentBlockApi,
  AppointmentTypeApi,
  ApprovalRequestApi,
  Configuration,
  EmployeeOmsProcedureApi,
  FileApi,
  ProcedureApi,
  ProgressEntryApi,
} from "@eshg/employee-portal-api/officialMedicalService";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useAppointmentBlockApi() {
  return new AppointmentBlockApi(useConfiguration());
}

export function useAppointmentTypeApi() {
  return new AppointmentTypeApi(useConfiguration());
}

export function useProgressEntryApi() {
  return new ProgressEntryApi(useConfiguration());
}

export function useProcedureApi() {
  return new ProcedureApi(useConfiguration());
}

export function useFileApi() {
  const configuration = useConfiguration();
  return new FileApi(configuration);
}

export function useApprovalRequestApi() {
  return new ApprovalRequestApi(useConfiguration());
}

export function useEmployeeOmsProcedureApi() {
  const configuration = useConfiguration();
  return new EmployeeOmsProcedureApi(configuration);
}
