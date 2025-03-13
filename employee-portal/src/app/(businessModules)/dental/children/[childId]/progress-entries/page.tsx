/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  fileApiQueryKey,
  keyDocumentTypes,
  moduleUserGroup,
  progressEntryApiQueryKey,
  systemProgressEntryTypeTitles,
  useDentalApi,
} from "@eshg/dental";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { DentalChildRouteParams } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { ProgressEntriesPage } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesPage";

export default function DentalProgressEntriesPage(
  props: DynamicPageProps<DentalChildRouteParams>,
) {
  const { childId } = props.params;
  const searchParams = props.searchParams;
  const { progressEntryApi, procedureApi, fileApi, approvalRequestApi } =
    useDentalApi();

  return (
    <ProgressEntriesPage
      procedureId={childId}
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
