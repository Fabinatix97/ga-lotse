/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGrantAuditLogAccessRequest } from "@eshg/employee-portal-api/auditlog";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useAuditlogApi } from "@/lib/auditlog/api/clients";

export function useGrantAuditLogAccess() {
  const auditlogApi = useAuditlogApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async ({
      source,
      date,
      idsOfGrantedUser,
    }: ApiGrantAuditLogAccessRequest) => {
      await auditlogApi.grantAuditLogAccess({
        source,
        date,
        idsOfGrantedUser,
      });
    },
    onSuccess: () => {
      snackbar.confirmation("Das Auditlog wurde freigegeben.");
    },
  });
}
