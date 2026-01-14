/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ProgressEntriesPage } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import {
  useApprovalRequestApi,
  useFileApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/measlesProtection/api/clients";
import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";
import { systemProgressEntryTypeTitles } from "@/lib/businessModules/measlesProtection/shared/constants";
import { moduleUserGroup } from "@/lib/businessModules/measlesProtection/shared/moduleUserGroup";

export default function MeaslesProtectionProcedureDataProgressEntriesTab(
  props: DynamicPageProps<MeaslesProtectionDetailsRouteParamsSchema>,
) {
  const { id } = use(props.params);
  const searchParams = use(props.searchParams);
  const progressEntryApi = useProgressEntryApi();
  const procedureApi = useProcedureApi();
  const fileApi = useFileApi();
  const approvalRequestApi = useApprovalRequestApi();

  return (
    <ProgressEntriesPage
      businessModule={ApiBusinessModule.MeaslesProtection}
      procedureId={id}
      searchParams={searchParams}
      leaderRole={ApiUserRole.MeaslesProtectionLeader}
      systemProgressEntryTypes={systemProgressEntryTypeTitles}
      groupName={moduleUserGroup.group}
      progressEntryApi={progressEntryApi}
      procedureApi={procedureApi}
      fileApi={fileApi}
      approvalRequestApi={approvalRequestApi}
    />
  );
}
