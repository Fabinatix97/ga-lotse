/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ProgressEntriesPage } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import { moduleUserGroup } from "../config/moduleUserGroup";
import { useProstituteProtectionApiClients } from "../contexts/ProstituteProtectionApi";
import { ProstituteProtectionProcedureRouteParams } from "../schemas/ProstituteProtectionProcedureRouteParams";
import {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "../shared/constants";
import { useProcedureRouteParams } from "../shared/hooks/useProcedureRouteParams";

export function ProstituteProtectionProgressEntriesPage(
  props: DynamicPageProps<ProstituteProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = useProcedureRouteParams(props.params);
  const searchParams = use(props.searchParams);

  const { progressEntryApi, procedureApi, fileApi, approvalRequestApi } =
    useProstituteProtectionApiClients();

  return (
    <ProgressEntriesPage
      businessModule={ApiBusinessModule.ProstituteProtection}
      procedureId={procedureId}
      searchParams={searchParams}
      leaderRole={ApiUserRole.ProstituteProtectionLeader}
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
