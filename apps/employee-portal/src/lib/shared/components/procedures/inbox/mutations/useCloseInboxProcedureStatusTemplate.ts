/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiInboxProcedureStatus,
  InboxProcedureApi,
} from "@eshg/lib-procedures-api";

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
