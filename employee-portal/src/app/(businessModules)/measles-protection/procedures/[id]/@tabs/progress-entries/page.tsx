/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import { useDownloadMeaslesProtectionFile } from "@/lib/businessModules/measlesProtection/api/download/files";
import {
  useDecideApprovalRequest,
  useGrantDeletionForAllRequests,
} from "@/lib/businessModules/measlesProtection/api/mutations/approvalRequests";
import {
  useDeleteFile,
  useRequestFileDeletion,
} from "@/lib/businessModules/measlesProtection/api/mutations/files";
import {
  useCreateProgressEntry,
  useDeleteProgressEntry,
  usePatchProgressEntry,
  useRequestProgressEntryDeletion,
} from "@/lib/businessModules/measlesProtection/api/mutations/progressEntries";
import { useGetMetaDataHistory } from "@/lib/businessModules/measlesProtection/api/queries/files";
import {
  useFetchProgressEntries,
  useFetchProgressEntryDetails,
  useGetManualProgressEntryHistory,
} from "@/lib/businessModules/measlesProtection/api/queries/progressEntries";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/measlesProtection/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/measlesProtection/shared/moduleUserGroup";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function MeaslesProtectionProcedureDataProgressEntriesTab(
  props: ProgressEntriesUrlParams,
) {
  return (
    <ProgressEntriesPage
      useCreateProgressEntry={useCreateProgressEntry}
      useDeleteFile={useDeleteFile}
      useDeleteProgressEntry={useDeleteProgressEntry}
      usePatchProgressEntry={usePatchProgressEntry}
      useFetchProgressEntries={useFetchProgressEntries}
      useFetchProgressEntryDetails={useFetchProgressEntryDetails}
      urlParams={props}
      leaderRole={ApiUserRole.MeaslesProtectionLeader}
      useRequestProgressEntryDeletion={useRequestProgressEntryDeletion}
      useRequestFileDeletion={useRequestFileDeletion}
      useDecideApprovalRequest={useDecideApprovalRequest}
      useGrantDeletionForAllRequests={useGrantDeletionForAllRequests}
      useDownloadFile={useDownloadMeaslesProtectionFile}
      useGetManualProgressEntryHistory={useGetManualProgressEntryHistory}
      useGetMetaDataHistory={useGetMetaDataHistory}
      routes={{
        entryDetails: (procedureId, entryId) =>
          routes.procedures
            .details(procedureId)
            .progressEntries.details(entryId),
        progressEntries: (procedureId) =>
          routes.procedures.details(procedureId).progressEntries.index,
      }}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      groupName={moduleUserGroup.group}
    />
  );
}
