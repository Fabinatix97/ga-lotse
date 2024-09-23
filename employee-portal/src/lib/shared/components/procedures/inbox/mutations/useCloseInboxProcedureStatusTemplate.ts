/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiInboxProcedureStatus,
  InboxProcedureApi,
} from "@eshg/employee-portal-api/businessProcedures";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

type UseCloseInboxProcedureResult = ReturnType<
  typeof useCloseInboxProcedureTemplate
>;
export type UseCloseInboxProcedure = () => UseCloseInboxProcedureResult;

export function useCloseInboxProcedureTemplate(
  useInboxProcedureApi: () => Pick<
    InboxProcedureApi,
    "updateInboxProcedureStatus"
  >,
) {
  const inboxProcedureApi = useInboxProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (inboxProcedureId: string) =>
      await inboxProcedureApi.updateInboxProcedureStatus(
        inboxProcedureId,
        ApiInboxProcedureStatus.Closed,
      ),
    onSuccess: () => {
      snackbar.confirmation("Posteingangsvorgang erfolgreich geschlossen.");
    },
  });
}
