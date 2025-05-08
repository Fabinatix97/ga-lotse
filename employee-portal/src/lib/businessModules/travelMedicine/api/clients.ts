/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AppointmentBlockApi,
  AppointmentTypeApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  DiseaseApi,
  FileApi,
  GdprValidationTaskApi,
  InboxProcedureApi,
  InformationStatementTemplateApi,
  MedicalHistoryApi,
  MedicalHistoryTemplateApi,
  OtherServiceTemplateApi,
  ProcedureApi,
  ProcedureStepApi,
  ProgressEntryApi,
  UnusedBaseInventoryVaccineApi,
  VaccinationConsultationApi,
  VaccineApi,
} from "@eshg/travel-medicine-api";

import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

export function useConfiguration() {
  const configurationParameters = useEmployeePortalApiConfiguration(
    "PUBLIC_TRAVEL_MEDICINE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useVaccineApi() {
  const configuration = useConfiguration();
  return new VaccineApi(configuration);
}

export function useUnusedBaseInventoryVaccineApi() {
  const configuration = useConfiguration();
  return new UnusedBaseInventoryVaccineApi(configuration);
}

export function useAppointmentBlockApi() {
  return new AppointmentBlockApi(useConfiguration());
}

export function useAppointmentTypeApi() {
  return new AppointmentTypeApi(useConfiguration());
}

export function useInformationStatementTemplateApi() {
  return new InformationStatementTemplateApi(useConfiguration());
}

export function useDiseaseApi() {
  return new DiseaseApi(useConfiguration());
}

export function useMedicalHistoryApi() {
  return new MedicalHistoryApi(useConfiguration());
}

export function useMedicalHistoryTemplateApi() {
  return new MedicalHistoryTemplateApi(useConfiguration());
}

export function useOtherServiceTemplateApi() {
  return new OtherServiceTemplateApi(useConfiguration());
}

export function useInboxProcedureApi() {
  return new InboxProcedureApi(useConfiguration());
}

export function useVaccinationConsultationApi() {
  return new VaccinationConsultationApi(useConfiguration());
}

export function useProcedureStepApi() {
  return new ProcedureStepApi(useConfiguration());
}

export function useProgressEntryApi() {
  return new ProgressEntryApi(useConfiguration());
}

export function useProcedureApi() {
  return new ProcedureApi(useConfiguration());
}

export function useFileApi() {
  return new FileApi(useConfiguration());
}

export function useApprovalRequestApi() {
  return new ApprovalRequestApi(useConfiguration());
}

export function useArchivingApi() {
  const configuration = useConfiguration();
  return new ArchivingApi(configuration);
}

export function useGdprValidationTaskApi() {
  const configuration = useConfiguration();
  return new GdprValidationTaskApi(configuration);
}
