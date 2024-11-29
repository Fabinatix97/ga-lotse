/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AppointmentBlockApi,
  AppointmentTypeApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  FileApi,
  MedicalHistoryApi,
  MedicalHistoryDocumentApi,
  ProcedureApi,
  ProgressEntryApi,
  StiProtectionProcedureApi,
  WaitingRoomApi,
} from "@eshg/employee-portal-api/stiProtection";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configParameters = useApiConfiguration(
    "PUBLIC_STI_PROTECTION_BACKEND_URL",
  );
  return new Configuration(configParameters);
}

export function useStiProtectionProcedureApi() {
  const config = useConfiguration();
  return new StiProtectionProcedureApi(config);
}

export function useProcedureApi() {
  const config = useConfiguration();
  return new ProcedureApi(config);
}

export function useProgressEntryApi() {
  const config = useConfiguration();
  return new ProgressEntryApi(config);
}

export function useFileApi() {
  const config = useConfiguration();
  return new FileApi(config);
}

export function useMedicalHistoryApi() {
  const config = useConfiguration();
  return new MedicalHistoryApi(config);
}

export function useMedicalHistoryDocumentApi() {
  const config = useConfiguration();
  return new MedicalHistoryDocumentApi(config);
}

export function useApprovalRequestApi() {
  const config = useConfiguration();
  return new ApprovalRequestApi(config);
}

export function useAppointmentBlockApi() {
  const config = useConfiguration();
  return new AppointmentBlockApi(config);
}

export function useAppointmentTypeApi() {
  const config = useConfiguration();
  return new AppointmentTypeApi(config);
}

export function useArchivingApi() {
  const config = useConfiguration();
  return new ArchivingApi(config);
}

export function useWaitingRoomApi() {
  const config = useConfiguration();
  return new WaitingRoomApi(config);
}
