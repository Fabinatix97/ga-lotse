/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AppointmentBlockApi,
  AppointmentTypeApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  DiseaseApi,
  EditorApi,
  FileApi,
  InboxProcedureApi,
  InformationStatementTemplateApi,
  MedicalHistoryApi,
  MedicalHistoryTemplateApi,
  OtherServiceTemplateApi,
  ProcedureApi,
  ProcedureStepApi,
  ProgressEntryApi,
  TextBlockApi,
  TravelMedicineFeatureTogglesPublicApi,
  UnusedBaseInventoryVaccineApi,
  VaccinationConsultationApi,
  VaccineApi,
} from "@eshg/employee-portal-api/travelMedicine";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
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

export function useFeatureTogglesApi() {
  return new TravelMedicineFeatureTogglesPublicApi(useConfiguration());
}

export function useEditorApi() {
  return new EditorApi(useConfiguration());
}

export function useTextBlockApi() {
  return new TextBlockApi(useConfiguration());
}

export function useArchivingApi() {
  const configuration = useConfiguration();
  return new ArchivingApi(configuration);
}
