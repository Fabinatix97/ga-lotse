/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use server";

import { ApiUserRole } from "@eshg/base-api";
import {
  ApiBusinessModule,
  ApiGetDetailedProcedureResponse,
  ApiGetProcedureApprovalRequestsResponse,
  ApiGetProgressEntriesResponse,
  ApiProgressEntryClass,
  ApiProgressEntryReferenceFilePair,
  GetProgressEntriesRequest,
} from "@eshg/lib-procedures-api";

import { UseFilterSettings } from "../../filters/hooks/useFilterSettings";

import { ProgressEntryClients } from "./api";

export interface EntryDeletionModalProps {
  onSuccessfulDeletion: () => void;
}

export type ProgressEntriesSearchParams = Omit<
  GetProgressEntriesRequest,
  "procedureId"
>;

export interface ProgressEntriesConfig extends ProgressEntryClients {
  businessModule: ApiBusinessModule;
  procedureId: string;
  progressEntries: ApiGetProgressEntriesResponse;
  detailedProcedure: ApiGetDetailedProcedureResponse;
  files: ApiProgressEntryReferenceFilePair[];
  searchParams: ProgressEntriesSearchParams;
  filterSettings: UseFilterSettings;
  leaderRole: ApiUserRole;
  keyDocumentTypes: Record<string, string>;
  progressEntryTypes: Record<string, string>;
  approvalRequestsResponse?: ApiGetProcedureApprovalRequestsResponse;
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
