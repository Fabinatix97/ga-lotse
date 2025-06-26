/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiPutOmsConfigRequest } from "@eshg/official-medical-service-api";

import { useConfiguratorOmsApi } from "@/lib/shared/api/clients";

export function useUpdateOms() {
  const snackbar = useSnackbar();
  const api = useConfiguratorOmsApi();

  return useHandledMutation({
    mutationFn: ({
      concerns,
      landingContentDe,
      landingContentEn,
      ...configRequest
    }: {
      concerns?: Blob;
      landingContentDe?: Blob;
      landingContentEn?: Blob;
    } & ApiPutOmsConfigRequest) =>
      api.putOmsConfig(
        configRequest,
        concerns,
        landingContentDe,
        landingContentEn,
      ),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });
}
