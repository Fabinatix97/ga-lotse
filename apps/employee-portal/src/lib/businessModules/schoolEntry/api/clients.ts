/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AppointmentBlockApi,
  AppointmentBlockDefaultAvailabilityApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  FileApi,
  GdprValidationTaskApi,
  ImportApi,
  InboxProcedureApi,
  ProcedureApi,
  ProcedureLabelApi,
  ProgressEntryApi,
  SchoolEntryApi,
  SchoolEntryAppointmentStandardDurationApi,
  SchoolEntryConfigApi,
  SchoolEntryCountryCodesApi,
  SchoolEntryFeatureTogglesApi,
  ValueEvaluatorApi,
} from "@eshg/school-entry-api";

import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

export function useConfiguration() {
  const configurationParameters = useEmployeePortalApiConfiguration(
    "PUBLIC_SCHOOL_ENTRY_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useSchoolEntryApi() {
  const configuration = useConfiguration();
  return new SchoolEntryApi(configuration);
}

export function useFeatureTogglesApi() {
  const configuration = useConfiguration();
  return new SchoolEntryFeatureTogglesApi(configuration);
}

export function useCountryCodesApi() {
  const configuration = useConfiguration();
  return new SchoolEntryCountryCodesApi(configuration);
}

export function useAppointmentBlockApi() {
  const configuration = useConfiguration();
  return new AppointmentBlockApi(configuration);
}

export function useAppointmentBlockDefaultAvailabilityApi() {
  const configuration = useConfiguration();
  return new AppointmentBlockDefaultAvailabilityApi(configuration);
}

export function useAppointmentStandardDurationsApi() {
  const configuration = useConfiguration();
  return new SchoolEntryAppointmentStandardDurationApi(configuration);
}

export function useValueEvaluatorApi() {
  const configuration = useConfiguration();
  return new ValueEvaluatorApi(configuration);
}

export function useImportApi() {
  const configuration = useConfiguration();
  return new ImportApi(configuration);
}

export function useLabelApi() {
  const configuration = useConfiguration();
  return new ProcedureLabelApi(configuration);
}

export function useConfigApi() {
  const configuration = useConfiguration();
  return new SchoolEntryConfigApi(configuration);
}

export function useInboxProcedureApi() {
  const configuration = useConfiguration();
  return new InboxProcedureApi(configuration);
}

export function useProgressEntryApi() {
  const configuration = useConfiguration();
  return new ProgressEntryApi(configuration);
}

export function useProcedureApi() {
  const configuration = useConfiguration();
  return new ProcedureApi(configuration);
}

export function useFileApi() {
  const configuration = useConfiguration();
  return new FileApi(configuration);
}

export function useApprovalRequestApi() {
  const configuration = useConfiguration();
  return new ApprovalRequestApi(configuration);
}

export function useArchivingApi() {
  const configuration = useConfiguration();
  return new ArchivingApi(configuration);
}

export function useGdprValidationTaskApi() {
  const configuration = useConfiguration();
  return new GdprValidationTaskApi(configuration);
}
