/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApprovalRequestApi,
  FileApi,
  ProcedureApi,
  ProgressEntryApi,
} from "@eshg/lib-procedures-api";

export interface ProgressEntryClients {
  progressEntryApi: ProgressEntryClient;
  procedureApi: ProcedureClient;
  fileApi: FileClient;
  approvalRequestApi: ApprovalRequestClient;
  getHeadersForOfflineCaching?: GetHeadersForOfflineCaching;
}

export type ProgressEntryClient = Pick<
  ProgressEntryApi,
  | "addProgressEntry"
  | "removeProgressEntry"
  | "patchProgressEntry"
  | "getProgressEntriesRaw"
  | "getProgressEntry"
  | "requestProgressEntryDeletion"
  | "getManualProgressEntryHistory"
>;

export type ProcedureClient = Pick<
  ProcedureApi,
  "getDetailedProcedure" | "getProcedureFileDetails" | "getApprovalRequests"
>;

export type FileClient = Pick<
  FileApi,
  | "downloadFileRaw"
  | "getMetaDataHistory"
  | "deleteFile"
  | "requestFileDeletion"
  | "updateFileMetaData"
>;

export type ApprovalRequestClient = Pick<
  ApprovalRequestApi,
  "decideApprovalRequest"
>;

export type GetHeadersForOfflineCaching = (procedureId?: string) => RequestInit;
