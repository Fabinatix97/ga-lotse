/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration as BaseConfiguration,
  ConfigurationParameters as BaseConfigurationParameters,
  UserApi,
} from "@eshg/base-api";
import {
  ApiConfiguration,
  apiMiddlewares,
  useApiConfiguration,
} from "@eshg/lib-portal";
import {
  AppointmentBlockApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  FileApi,
  GdprValidationTaskApi,
  InboxProcedureApi,
  ProcedureApi,
  ProgressEntryApi,
  TaskApi,
  TestHelperApi,
} from "@eshg/prostitute-protection-api";

export function createClients(baseUrl: string) {
  const config = new Configuration({
    basePath: baseUrl,
    middleware: apiMiddlewares,
  });
  return {
    appointmentBlockApi: new AppointmentBlockApi(config),
    archivingApi: new ArchivingApi(config),
    inboxProcedureApi: new InboxProcedureApi(config),
    procedureApi: new ProcedureApi(config),
    testHelperApi: new TestHelperApi(config),
    fileApi: new FileApi(config),
    progressEntryApi: new ProgressEntryApi(config),
    approvalRequestApi: new ApprovalRequestApi(config),
    gdprValidationTaskApi: new GdprValidationTaskApi(config),
    taskApi: new TaskApi(config),
  };
}
export type ProstituteProtectionClients = ReturnType<typeof createClients>;

function useBaseEmployeePortalApiConfiguration(
  basePathName: keyof ApiConfiguration,
): BaseConfigurationParameters {
  return useApiConfiguration(basePathName, "de");
}

export function useBaseConfiguration() {
  const configurationParameters = useBaseEmployeePortalApiConfiguration(
    "PUBLIC_BASE_BACKEND_URL" as keyof ApiConfiguration,
  );
  return new BaseConfiguration(configurationParameters);
}

export function useUserApi() {
  const configuration = useBaseConfiguration();
  return new UserApi(configuration);
}
