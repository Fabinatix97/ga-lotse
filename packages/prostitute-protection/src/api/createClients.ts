/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { apiMiddlewares } from "@eshg/lib-portal";
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
  ProstituteProtectionApi,
  ProstituteProtectionAppointmentStandardDurationApi,
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
    appointmentStandardDurationApi:
      new ProstituteProtectionAppointmentStandardDurationApi(config),
    archivingApi: new ArchivingApi(config),
    inboxProcedureApi: new InboxProcedureApi(config),
    procedureApi: new ProcedureApi(config),
    testHelperApi: new TestHelperApi(config),
    fileApi: new FileApi(config),
    progressEntryApi: new ProgressEntryApi(config),
    approvalRequestApi: new ApprovalRequestApi(config),
    gdprValidationTaskApi: new GdprValidationTaskApi(config),
    taskApi: new TaskApi(config),
    prostituteProtectionApi: new ProstituteProtectionApi(config),
  };
}
export type ProstituteProtectionClients = ReturnType<typeof createClients>;
