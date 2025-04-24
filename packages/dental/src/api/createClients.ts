/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApprovalRequestApi,
  BaseAPI,
  ChildApi,
  Configuration,
  FileApi,
  GdprValidationTaskApi,
  ProcedureApi,
  ProcedureLabelApi,
  ProgressEntryApi,
  ProphylaxisSessionApi,
} from "@eshg/dental-api";
import { apiMiddlewares } from "@eshg/lib-portal/config/apiMiddlewares";

export type DentalClients = ReturnType<typeof createClients>;

export function createClients(baseUrl: string) {
  const configuration = new Configuration({
    basePath: baseUrl,
    middleware: apiMiddlewares,
  });

  return {
    childApi: new ChildApi(configuration),
    prophylaxisSessionApi: new ProphylaxisSessionApi(configuration),
    procedureApi: new ProcedureApi(configuration),
    progressEntryApi: new ProgressEntryApi(configuration),
    fileApi: new FileApi(configuration),
    approvalRequestApi: new ApprovalRequestApi(configuration),
    procedureLabelApi: new ProcedureLabelApi(configuration),
    gdprValidationTaskApi: new GdprValidationTaskApi(configuration),
  } satisfies Record<string, BaseAPI>;
}
