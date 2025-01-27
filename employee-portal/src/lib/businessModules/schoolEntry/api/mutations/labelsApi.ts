/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { CreateLabelRequest, UpdateLabelRequest } from "@eshg/school-entry-api";

import { useLabelApi } from "@/lib/businessModules/schoolEntry/api/clients";

export function useCreateLabel() {
  const labelApi = useLabelApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: CreateLabelRequest) =>
      labelApi.createLabelRaw(request).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Kennung erfolgreich angelegt.");
    },
  });
}

export function useUpdateLabel() {
  const labelApi = useLabelApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateLabelRequest) =>
      labelApi.updateLabelRaw(request).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Kennung erfolgreich geändert.");
    },
  });
}
