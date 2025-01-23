/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use server";

import { ApiUserRole } from "@eshg/base-api";
import {
  ApiApprovalRequest,
  ApiCreateApprovalRequestRequest,
  ApiCreateManualProgressEntryRequest,
  ApiFileMetaData,
  ApiGetDetailedProcedureResponse,
  ApiGetFile200Response,
  ApiGetProcedureApprovalRequestsResponse,
  ApiGetProgressEntriesResponseProgressEntriesInner,
  ApiGetProgressEntryResponse,
  ApiManualProgressEntry,
  ApiPatchManualProgressEntryRequest,
  ApiProgressEntryClass,
  ApiProgressEntryReferenceFilePair,
  ApiUpdateFileMetaDataRequest,
  GetProgressEntriesRequest,
} from "@eshg/employee-portal-api/businessProcedures";
import { SearchParams } from "@eshg/lib-portal/helpers/searchParams";
import {
  UseMutationResult,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";

import { UseFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";

export type DynamicRoute = (fileId: string) => string;

export interface EntryDeletionModalProps {
  onSuccessfulDeletion: () => void;
}

export type ProgressEntriesSearchParams = Omit<
  GetProgressEntriesRequest,
  "procedureId"
>;

export interface ProgressEntriesPageProps extends ProgressEntryApiMethods {
  procedureId: string;
  searchParams: SearchParams;
  leaderRole: ApiUserRole;
  systemProgressEntryTypes: Record<string, string>;
  groupName: string;
  additionalKeyDocumentTypes?: Record<string, string>;
  getInitOverrides?: (inspectionId?: string) => RequestInit;
}

export interface ProgressEntriesConfig extends ProgressEntryApiActions {
  procedureId: string;
  progressEntries: ApiGetProgressEntriesResponseProgressEntriesInner[];
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

interface ProgressEntryApiActions {
  useCreateProgressEntry: () => UseMutationResult<
    ApiManualProgressEntry,
    Error,
    {
      request: ApiCreateManualProgressEntryRequest;
      file?: File | undefined;
      fileMetaData?: ApiFileMetaData | undefined;
    },
    unknown
  >;
  useDeleteFile: () => UseMutationResult<void, Error, string, unknown>;
  useDeleteProgressEntry: () => UseMutationResult<void, Error, string, unknown>;

  usePatchProgressEntry(): UseMutationResult<
    {
      entry?: ApiManualProgressEntry;
      file?: ApiGetFile200Response;
    },
    Error,
    {
      entryId: string;
      patchProgressEntryRequest?: ApiPatchManualProgressEntryRequest;
      fileId?: string;
      updateFileMetaDataRequest?: ApiUpdateFileMetaDataRequest;
    },
    unknown
  >;

  useRequestProgressEntryDeletion: () => UseMutationResult<
    ApiApprovalRequest,
    Error,
    {
      entryId: string;
      createApprovalRequest: ApiCreateApprovalRequestRequest;
    },
    unknown
  >;
  useRequestFileDeletion: () => UseMutationResult<
    ApiApprovalRequest,
    Error,
    {
      fileId: string;
      createApprovalRequest: ApiCreateApprovalRequestRequest;
    },
    unknown
  >;
  useDecideApprovalRequest: () => UseMutationResult<
    void,
    Error,
    {
      approvalRequestId: string;
      decision: string;
    },
    unknown
  >;
  useGrantDeletionForAllRequests: () => UseMutationResult<
    void,
    Error,
    ApiApprovalRequest[],
    unknown
  >;
  useDownloadFile: () => (fileId: string) => Promise<File>;
  useGetManualProgressEntryHistory: (
    entryId: string,
  ) => UseSuspenseQueryResult<HistoryItem[] | undefined, Error>;
  useGetMetaDataHistory: (
    fileId: string,
  ) => UseSuspenseQueryResult<HistoryItem[] | undefined, Error>;
  useFetchProgressEntryDetails: (
    procedureId: string,
    progressEntryId: string,
  ) => UseSuspenseQueryResult<ApiGetProgressEntryResponse, Error>;
}

interface ProgressEntryApiMethods extends ProgressEntryApiActions {
  useFetchProgressEntries: (
    procedureId: string,
    leaderRole: ApiUserRole,
    progressEntryFilter: ProgressEntriesFilters,
  ) => UseSuspenseQueryResult<
    {
      detailedProcedure: ApiGetDetailedProcedureResponse;
      files: ApiProgressEntryReferenceFilePair[];
      progressEntries: ApiGetProgressEntriesResponseProgressEntriesInner[];
      approvalRequestsResponse:
        | ApiGetProcedureApprovalRequestsResponse
        | undefined;
    },
    Error
  >;
  useFetchProgressEntryDetails: (
    procedureId: string,
    progressEntryId: string,
  ) => UseSuspenseQueryResult<ApiGetProgressEntryResponse, Error>;
}

export interface HistoryItem {
  changedAt: Date;
  text: string | undefined;
}

export interface ProgressEntriesFilters {
  initiatedBy?: Set<string>;
  progressEntryType?: Set<string>;
  progressEntryClass?: Set<ApiProgressEntryClass>;
}
