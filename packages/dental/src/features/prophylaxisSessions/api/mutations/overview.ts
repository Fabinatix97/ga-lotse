/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateProphylaxisSessionRequest } from "@eshg/dental-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useDentalApi } from "@/contexts/dental";

export function useCreateProphylaxisSession() {
  const { prophylaxisSessionApi } = useDentalApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiCreateProphylaxisSessionRequest) =>
      prophylaxisSessionApi.createProphylaxisSession(request),
    onSuccess: () => {
      snackbar.confirmation("Prophylaxe erfolgreich angelegt.");
    },
  });
}
