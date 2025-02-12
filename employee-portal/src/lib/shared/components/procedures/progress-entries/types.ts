/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use server";

import { ApiUserRole } from "@eshg/base-api";
import { QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { SearchParams } from "@eshg/lib-portal/helpers/searchParams";
import {
  ApiGetDetailedProcedureResponse,
  ApiGetProcedureApprovalRequestsResponse,
  ApiGetProgressEntriesResponse,
  ApiProgressEntryClass,
  ApiProgressEntryReferenceFilePair,
  ApprovalRequestApi,
  FileApi,
  GetProgressEntriesRequest,
  ProcedureApi,
  ProgressEntryApi,
} from "@eshg/lib-procedures-api";

import { UseFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";

export interface EntryDeletionModalProps {
  onSuccessfulDeletion: () => void;
}

export type ProgressEntriesSearchParams = Omit<
  GetProgressEntriesRequest,
  "procedureId"
>;

export interface ProgressEntriesPageProps extends ProgressEntryClients {
  procedureId: string;
  searchParams: SearchParams;
  leaderRole: ApiUserRole;
  systemProgressEntryTypes: Record<string, string>;
  groupName: string;
  additionalKeyDocumentTypes?: Record<string, string>;
  getInitOverrides?: (inspectionId?: string) => RequestInit;
}

export interface ProgressEntriesConfig extends ProgressEntryClients {
  procedureId: string;
  progressEntries: ApiGetProgressEntriesResponse;
  detailedProcedure: ApiGetDetailedProcedureResponse;
  files: ApiProgressEntryReferenceFilePair[];
  searchParams: ProgressEntriesSearchParams;
  filterSettings: UseFilterSettings;
  leaderRole: ApiUserRole;
  keyDocumentTypes: Record<string, string>;
  approvalRequestsResponse?: ApiGetProcedureApprovalRequestsResponse;
}

export interface ProgressEntriesUrlParams<TPageParams = unknown> {
  params: Readonly<TPageParams>;
  searchParams: SearchParams;
}

interface ProgressEntryClients {
  progressEntryApiQueryKey: QueryKeyFactory;
  progressEntryApi: ProgressEntryClient;
  procedureApi: ProcedureClient;
  fileApiQueryKey: QueryKeyFactory;
  fileApi: FileClient;
  approvalRequestApi: ApprovalRequestClient;
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

export interface HistoryItem {
  changedAt: Date;
  text: string | undefined;
}

export interface ProgressEntriesFilters {
  initiatedBy?: Set<string>;
  progressEntryType?: Set<string>;
  progressEntryClass?: Set<ApiProgressEntryClass>;
}
