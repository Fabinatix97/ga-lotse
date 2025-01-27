/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "@eshg/dental/api/queries/apiQueryKeys";
import { useDentalApi } from "@eshg/dental/shared/DentalProvider";
import { moduleUserGroup } from "@eshg/dental/shared/moduleUserGroup";
import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "@eshg/dental/shared/progressEntries";

import { DentalChildPageParams } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function DentalProgressEntriesPage(
  props: ProgressEntriesUrlParams<DentalChildPageParams>,
) {
  const { params, searchParams } = props;
  const { progressEntryApi, procedureApi, fileApi, approvalRequestApi } =
    useDentalApi();

  return (
    <ProgressEntriesPage
      procedureId={params.childId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.DentalLeader}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      additionalKeyDocumentTypes={keyDocumentTypes}
      groupName={moduleUserGroup.group}
      progressEntryApiQueryKey={progressEntryApiQueryKey}
      progressEntryApi={progressEntryApi}
      procedureApi={procedureApi}
      fileApiQueryKey={fileApiQueryKey}
      fileApi={fileApi}
      approvalRequestApi={approvalRequestApi}
    />
  );
}
