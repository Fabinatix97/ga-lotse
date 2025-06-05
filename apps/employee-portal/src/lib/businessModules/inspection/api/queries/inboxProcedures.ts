/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useInboxProcedureApi } from "@/lib/businessModules/inspection/api/clients";
import { inboxProcedureApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import {
  useFetchInboxProcedureTemplate,
  useFetchInboxProceduresTemplate,
} from "@/lib/shared/api/queries/inboxProcedures";

export function useFetchInboxProcedures() {
  return useFetchInboxProceduresTemplate(
    useInboxProcedureApi,
    inboxProcedureApiQueryKey,
  );
}

export function useFetchInboxProcedure(inboxProcedureId: string) {
  return useFetchInboxProcedureTemplate(
    useInboxProcedureApi,
    inboxProcedureApiQueryKey,
    inboxProcedureId,
  );
}
