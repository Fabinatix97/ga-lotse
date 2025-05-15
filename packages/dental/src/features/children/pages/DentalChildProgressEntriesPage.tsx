/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ProgressEntriesPage } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "../../../config/progressEntries";
import { moduleUserGroup } from "../../../config/userGroups";
import { useDentalApi } from "../../../contexts/dental";
import { useChildRouteParams } from "../hooks/useChildRouteParams";
import { DentalChildRouteParams } from "../schemas/DentalChildRouteParams";

export function DentalChildProgressEntriesPage(
  props: DynamicPageProps<DentalChildRouteParams>,
) {
  const { childId } = useChildRouteParams(props.params);
  const searchParams = use(props.searchParams);
  const { progressEntryApi, procedureApi, fileApi, approvalRequestApi } =
    useDentalApi();

  return (
    <ProgressEntriesPage
      businessModule={ApiBusinessModule.Dental}
      procedureId={childId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.DentalLeader}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      additionalKeyDocumentTypes={keyDocumentTypes}
      groupName={moduleUserGroup.group}
      progressEntryApi={progressEntryApi}
      procedureApi={procedureApi}
      fileApi={fileApi}
      approvalRequestApi={approvalRequestApi}
    />
  );
}
