/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateProphylaxisSessionRequest,
  DeleteProphylaxisSessionRequest,
} from "@eshg/dental-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useDentalApi } from "../../../../contexts/dental";

export function useCreateProphylaxisSession() {
  const { prophylaxisSessionApi } = useDentalApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiCreateProphylaxisSessionRequest) =>
      prophylaxisSessionApi.createProphylaxisSession(request),
    onSuccess: () => {
      snackbar.confirmation("Maßnahme erfolgreich geplant.");
    },
  });
}

export function useDeleteProphylaxisSession() {
  const { prophylaxisSessionApi } = useDentalApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: DeleteProphylaxisSessionRequest) =>
      prophylaxisSessionApi.deleteProphylaxisSessionRaw(request),
    onSuccess: () => {
      snackbar.confirmation("Maßnahme erfolgreich entfernt.");
    },
  });
}
