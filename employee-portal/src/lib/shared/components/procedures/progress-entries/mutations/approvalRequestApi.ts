/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiApprovalRequest } from "@eshg/lib-procedures-api";
import { useMutation } from "@tanstack/react-query";

import { ApprovalRequestClient } from "@/lib/shared/components/procedures/progress-entries/types";

export function useDecideApprovalRequest(
  approvalRequestApi: ApprovalRequestClient,
) {
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: decideApprovalRequest(approvalRequestApi),
    onSuccess: () =>
      snackbar.confirmation("Löschanfrage erfolgreich beantwortet."),
  });
}

export function useGrantDeletionForAllRequests(
  approvalRequestApi: ApprovalRequestClient,
) {
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: grantDeletionForAllRequests(approvalRequestApi),
    onSuccess: () =>
      snackbar.confirmation("Alle Löschanfragen wurden erfolgreich genehmigt."),
  });
}

function grantDeletionForAllRequests(
  approvalRequestApi: ApprovalRequestClient,
) {
  return async function (approvalRequests: ApiApprovalRequest[]) {
    for (const request of approvalRequests) {
      await decideApprovalRequest(approvalRequestApi)({
        approvalRequestId: request.approvalRequestId,
        decision: "GRANTED",
      });
    }
  };
}

function decideApprovalRequest(approvalRequestApi: ApprovalRequestClient) {
  return async function ({
    approvalRequestId,
    decision,
  }: {
    approvalRequestId: string;
    decision: string;
  }) {
    return await approvalRequestApi.decideApprovalRequest(
      approvalRequestId,
      decision,
    );
  };
}
