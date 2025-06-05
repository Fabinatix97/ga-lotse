/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { apiMiddlewares } from "@eshg/lib-portal";
import {
  AppointmentBlockApi,
  AppointmentTypeApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  FileApi,
  GdprValidationTaskApi,
  InboxProcedureApi,
  MedsAbroadApi,
  ProcedureApi,
  ProgressEntryApi,
  TaskApi,
  TestHelperApi,
} from "@eshg/meds-abroad-api";

export function createClients(baseUrl: string) {
  const config = new Configuration({
    basePath: baseUrl,
    middleware: apiMiddlewares,
  });
  return {
    AppointmentBlockApi: new AppointmentBlockApi(config),
    ArchivingApi: new ArchivingApi(config),
    InboxProcedureApi: new InboxProcedureApi(config),
    ProcedureApi: new ProcedureApi(config),
    TestHelperApi: new TestHelperApi(config),
    AppointmentTypeApi: new AppointmentTypeApi(config),
    FileApi: new FileApi(config),
    ProgressEntryApi: new ProgressEntryApi(config),
    ApprovalRequestApi: new ApprovalRequestApi(config),
    GdprValidationTaskApi: new GdprValidationTaskApi(config),
    MedsAbroadApi: new MedsAbroadApi(config),
    TaskApi: new TaskApi(config),
  };
}
export type MedsAbroadClients = ReturnType<typeof createClients>;
