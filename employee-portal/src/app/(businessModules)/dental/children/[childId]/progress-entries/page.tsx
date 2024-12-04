/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";

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
import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "@/lib/businessModules/dental/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/dental/shared/moduleUserGroup";
import { routes } from "@/lib/businessModules/dental/shared/routes";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import {
  ProgressEntriesPageProps,
  ProgressEntriesUrlParams,
} from "@/lib/shared/components/procedures/progress-entries/types";

const PROGRESS_ENTRY_ROUTES: ProgressEntriesPageProps["routes"] = {
  entryDetails: (procedureId, entryId) =>
    routes.children.byId(procedureId).progressEntries.byId(entryId),
  progressEntries: (procedureId) =>
    routes.children.byId(procedureId).progressEntries.overview,
};

interface DentalProgressEntriesPageParams extends DentalChildPageParams {
  progressEntryId?: string;
}

export default function DentalProgressEntriesPage(
  props: ProgressEntriesUrlParams<DentalProgressEntriesPageParams>,
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
      progressEntryId={params.progressEntryId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.DentalLeader}
      useRequestProgressEntryDeletion={useRequestProgressEntryDeletion}
      useRequestFileDeletion={useRequestFileDeletion}
      useDecideApprovalRequest={useDecideApprovalRequest}
      useGrantDeletionForAllRequests={useGrantDeletionForAllRequests}
      useDownloadFile={useDownloadDentalFile}
      useGetManualProgressEntryHistory={useGetManualProgressEntryHistory}
      useGetMetaDataHistory={useGetMetaDataHistory}
      routes={PROGRESS_ENTRY_ROUTES}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      additionalKeyDocumentTypes={keyDocumentTypes}
      groupName={moduleUserGroup.group}
    />
  );
}
