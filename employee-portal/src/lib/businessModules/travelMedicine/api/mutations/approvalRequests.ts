/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApprovalRequestApi } from "@/lib/businessModules/travelMedicine/api/clients";
import {
  useDecideApprovalRequestTemplate,
  useGrantDeletionForAllRequestsTemplate,
} from "@/lib/shared/api/mutations/approvalRequests";

export function useDecideApprovalRequest() {
  return useDecideApprovalRequestTemplate(useApprovalRequestApi);
}

export function useGrantDeletionForAllRequests() {
  return useGrantDeletionForAllRequestsTemplate(useApprovalRequestApi);
}
