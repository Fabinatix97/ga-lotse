/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { CheckPacklistElementRequest } from "@eshg/inspection-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { usePacklistApi } from "@/lib/businessModules/inspection/api/clients";
import { isServiceWorkerResponse } from "@/serviceWorker/common/common";

export function useCheckPacklistElement() {
  const packlistApi = usePacklistApi();
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: async (req: CheckPacklistElementRequest) => {
      const response = await packlistApi.checkPacklistElementRaw(req);
      const serverResponse = await unwrapRawResponse(response);
      return {
        ...serverResponse,
        serviceWorkerResponse: isServiceWorkerResponse(response),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification("Zwischengespeichert");
      } else {
        snackbar.confirmation("Erfolgreich gespeichert");
      }
    },
    onError: () => {
      snackbar.error("Daten konnten nicht gespeichert werden.");
    },
  });
}
