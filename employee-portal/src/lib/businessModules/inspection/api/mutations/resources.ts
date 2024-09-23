/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AddResourceRequest,
  DeleteResourceRequest,
} from "@eshg/employee-portal-api/inspection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";

export function useAddResource() {
  const inspectionApi = useInspectionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: AddResourceRequest) =>
      inspectionApi.addResourceRaw(req).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Ressource wurde gebucht.");
    },
  });
}

export function useDeleteResource() {
  const inspectionApi = useInspectionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: DeleteResourceRequest) =>
      inspectionApi.deleteResourceRaw(req).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Buchung wurde storniert.");
    },
  });
}
