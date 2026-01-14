/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AppointmentBlockApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  ConsultationApi,
  DiagnosisApi,
  ExaminationApi,
  FileApi,
  MedicalHistoryApi,
  MedicalHistoryDocumentApi,
  ProcedureApi,
  ProgressEntryApi,
  StiProtectionAppointmentStandardDurationApi,
  StiProtectionProcedureApi,
  TextTemplateApi,
  WaitingRoomApi,
} from "@eshg/sti-protection-api";

import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

export function useConfiguration() {
  const configParameters = useEmployeePortalApiConfiguration(
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

export function useAppointmentStandardDurationsApi() {
  const configuration = useConfiguration();
  return new StiProtectionAppointmentStandardDurationApi(configuration);
}

export function useArchivingApi() {
  const config = useConfiguration();
  return new ArchivingApi(config);
}

export function useWaitingRoomApi() {
  const config = useConfiguration();
  return new WaitingRoomApi(config);
}

export function useExaminationApi() {
  const config = useConfiguration();
  return new ExaminationApi(config);
}

export function useConsultationApi() {
  const config = useConfiguration();
  return new ConsultationApi(config);
}

export function useDiagnosisApi() {
  const config = useConfiguration();
  return new DiagnosisApi(config);
}

export function useTextTemplateApi() {
  const config = useConfiguration();
  return new TextTemplateApi(config);
}
