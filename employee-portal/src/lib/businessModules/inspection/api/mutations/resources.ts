/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AddResourceRequest,
  DeleteResourceRequest,
} from "@eshg/inspection-api";
import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

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
