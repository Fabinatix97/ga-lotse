/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { moduleUserGroup } from "@eshg/dental/shared/moduleUserGroup";
import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "@eshg/dental/shared/progressEntries";

import { DentalChildPageParams } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { useDownloadDentalFile } from "@/lib/businessModules/dental/api/downloads/files";
import {
  useDecideApprovalRequest,
  useGrantDeletionForAllRequests,
} from "@/lib/businessModules/dental/api/mutations/approvalRequestApi";
import {
  useDeleteFile,
  useRequestFileDeletion,
} from "@/lib/businessModules/dental/api/mutations/fileApi";
import {
  useCreateProgressEntry,
  useDeleteProgressEntry,
  usePatchProgressEntry,
  useRequestProgressEntryDeletion,
} from "@/lib/businessModules/dental/api/mutations/progressEntryApi";
import { useGetMetaDataHistory } from "@/lib/businessModules/dental/api/queries/fileApi";
import {
  useFetchProgressEntries,
  useFetchProgressEntryDetails,
  useGetManualProgressEntryHistory,
} from "@/lib/businessModules/dental/api/queries/progressEntryApi";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function DentalProgressEntriesPage(
  props: ProgressEntriesUrlParams<DentalChildPageParams>,
) {
  const { params, searchParams } = props;
  return (
    <ProgressEntriesPage
      useCreateProgressEntry={useCreateProgressEntry}
      useDeleteFile={useDeleteFile}
      useDeleteProgressEntry={useDeleteProgressEntry}
      usePatchProgressEntry={usePatchProgressEntry}
      useFetchProgressEntries={useFetchProgressEntries}
      useFetchProgressEntryDetails={useFetchProgressEntryDetails}
      procedureId={params.childId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.DentalLeader}
      useRequestProgressEntryDeletion={useRequestProgressEntryDeletion}
      useRequestFileDeletion={useRequestFileDeletion}
      useDecideApprovalRequest={useDecideApprovalRequest}
      useGrantDeletionForAllRequests={useGrantDeletionForAllRequests}
      useDownloadFile={useDownloadDentalFile}
      useGetManualProgressEntryHistory={useGetManualProgressEntryHistory}
      useGetMetaDataHistory={useGetMetaDataHistory}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      additionalKeyDocumentTypes={keyDocumentTypes}
      groupName={moduleUserGroup.group}
    />
  );
}
