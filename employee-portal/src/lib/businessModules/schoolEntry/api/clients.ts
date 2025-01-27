/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  AppointmentBlockApi,
  AppointmentTypeApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  FileApi,
  ImportApi,
  InboxProcedureApi,
  LabelApi,
  ProcedureApi,
  ProgressEntryApi,
  SchoolEntryApi,
  SchoolEntryConfigApi,
  SchoolEntryCountryCodesApi,
  SchoolEntryFeatureTogglesApi,
  ValueEvaluatorApi,
} from "@eshg/school-entry-api";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
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
  return new LabelApi(configuration);
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

export function useAppointmentTypeApi() {
  const configuration = useConfiguration();
  return new AppointmentTypeApi(configuration);
}

export function useArchivingApi() {
  const configuration = useConfiguration();
  return new ArchivingApi(configuration);
}
