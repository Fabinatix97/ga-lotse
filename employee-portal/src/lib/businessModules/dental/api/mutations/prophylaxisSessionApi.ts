/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateProphylaxisSessionRequest } from "@eshg/employee-portal-api/dental";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useProphylaxisSessionApi } from "@/lib/businessModules/dental/api/clients";

export function useCreateProphylaxisSession() {
  const prophylaxisSessionApi = useProphylaxisSessionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiCreateProphylaxisSessionRequest) =>
      prophylaxisSessionApi.createProphylaxisSession(request),
    onSuccess: () => {
      snackbar.confirmation("Prophylaxe erfolgreich angelegt.");
    },
  });
}
