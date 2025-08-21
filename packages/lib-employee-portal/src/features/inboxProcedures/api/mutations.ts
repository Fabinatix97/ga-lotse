/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiInboxProcedureStatus } from "@eshg/lib-procedures-api";

import { InboxProcedureClient } from "./client";

export function useCloseInboxProcedure(
  inboxProcedureApi: InboxProcedureClient,
) {
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
