/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback } from "react";

import { useSidebarWithFormRef } from "@eshg/lib-employee-portal";

import { useInboxProcedureApi } from "@/lib/businessModules/inspection/api/clients";
import { InspectionInboxProcedureCreateSidebar } from "@/lib/businessModules/inspection/components/inbox/InspectionInboxProcedureCreateSidebar";
import { useCloseInboxProcedureTemplate } from "@/lib/shared/components/procedures/inbox/mutations/useCloseInboxProcedureStatusTemplate";

export function useCloseInboxProcedure() {
  return useCloseInboxProcedureTemplate(useInboxProcedureApi);
}

export function useCreateInboxProcedure(inboxProcedureId: string) {
  const { open } = useSidebarWithFormRef({
    component: InspectionInboxProcedureCreateSidebar,
  });

  return useCallback(() => {
    open({ inboxProcedureId });
  }, [open, inboxProcedureId]);
}
