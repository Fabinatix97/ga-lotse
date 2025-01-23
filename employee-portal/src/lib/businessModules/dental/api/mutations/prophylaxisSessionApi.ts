/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateProphylaxisSessionRequest,
  ApiProphylaxisSessionDetails,
  ApiUpdateProphylaxisSessionParticipantsRequest,
} from "@eshg/dental-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useQueryClient } from "@tanstack/react-query";

import { useProphylaxisSessionApi } from "@/lib/businessModules/dental/api/clients";
import { getProphylaxisSessionQuery } from "@/lib/businessModules/dental/api/queries/prophylaxisSessionApi";

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

export function useUpdateProphylaxisSessionParticipants(
  prophylaxisSessionId: string,
) {
  const prophylaxisSessionApi = useProphylaxisSessionApi();
  const queryClient = useQueryClient();
  const { queryKey } = getProphylaxisSessionQuery(prophylaxisSessionApi, {
    prophylaxisSessionId,
  });

  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: ApiUpdateProphylaxisSessionParticipantsRequest) =>
      prophylaxisSessionApi.updateProphylaxisSessionParticipants(
        prophylaxisSessionId,
        request,
      ),
    onSuccess: (response: ApiProphylaxisSessionDetails) => {
      queryClient.setQueryData(queryKey, response);
    },
  });
}
