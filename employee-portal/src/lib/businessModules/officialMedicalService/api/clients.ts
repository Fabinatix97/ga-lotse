/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  AppointmentBlockApi,
  AppointmentTypeApi,
  ApprovalRequestApi,
  ConcernApi,
  Configuration,
  EmployeeOmsProcedureApi,
  FileApi,
  OmsAppointmentApi,
  OmsDocumentApi,
  OmsFileApi,
  ProcedureApi,
  ProgressEntryApi,
  WaitingRoomApi,
} from "@eshg/official-medical-service-api";

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

export function useConcernApi() {
  const configuration = useConfiguration();
  return new ConcernApi(configuration);
}

export function useOmsAppointmentApi() {
  const configuration = useConfiguration();
  return new OmsAppointmentApi(configuration);
}

export function useOmsDocumentApi() {
  const configuration = useConfiguration();
  return new OmsDocumentApi(configuration);
}

export function useOmsFileApi() {
  const configuration = useConfiguration();
  return new OmsFileApi(configuration);
}

export function useWaitingRoomApi() {
  const configuration = useConfiguration();
  return new WaitingRoomApi(configuration);
}
