/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApprovalRequestApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { progressEntryApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import {
  useDecideApprovalRequestTemplate,
  useGrantDeletionForAllRequestsTemplate,
} from "@/lib/shared/api/mutations/approvalRequests";

export function useDecideApprovalRequest() {
  return useDecideApprovalRequestTemplate(
    useApprovalRequestApi,
    progressEntryApiQueryKey([]),
  );
}

export function useGrantDeletionForAllRequests() {
  return useGrantDeletionForAllRequestsTemplate(
    useApprovalRequestApi,
    progressEntryApiQueryKey([]),
  );
}
