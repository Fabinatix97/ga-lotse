/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiApprovalRequest } from "@eshg/employee-portal-api/businessProcedures";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useMutation } from "@tanstack/react-query";

interface ApprovalRequestApi {
  decideApprovalRequest: (
    approvalRequestId: string,
    body: string,
  ) => Promise<void>;
}

export function useDecideApprovalRequestTemplate(
  useApprovalRequestApi: () => ApprovalRequestApi,
  mutationKey?: readonly string[],
) {
  const approvalRequestApi = useApprovalRequestApi();
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: decideApprovalRequest(approvalRequestApi),
    onSuccess: () =>
      snackbar.confirmation("Löschanfrage erfolgreich beantwortet."),
    mutationKey,
  });
}

export function useGrantDeletionForAllRequestsTemplate(
  useApprovalRequestApi: () => ApprovalRequestApi,
  mutationKey?: readonly string[],
) {
  const approvalRequestApi = useApprovalRequestApi();
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: grantDeletionForAllRequests(approvalRequestApi),
    onSuccess: () =>
      snackbar.confirmation("Alle Löschanfragen wurden erfolgreich genehmigt."),
    mutationKey,
  });
}

function grantDeletionForAllRequests(approvalRequestApi: ApprovalRequestApi) {
  return async function (approvalRequests: ApiApprovalRequest[]) {
    for (const request of approvalRequests) {
      await decideApprovalRequest(approvalRequestApi)({
        approvalRequestId: request.approvalRequestId,
        decision: "GRANTED",
      });
    }
  };
}

function decideApprovalRequest(approvalRequestApi: ApprovalRequestApi) {
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
