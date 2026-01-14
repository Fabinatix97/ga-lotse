/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from "@tanstack/react-query";

import { ApiPutInspectionPropertiesConfigurationRequest } from "@eshg/inspection-api";
import { useSnackbar } from "@eshg/lib-portal";

import { useConfigApi } from "@/lib/businessModules/inspection/api/clients";

export function useUpdateInspectionConfig() {
  const snackbar = useSnackbar();
  const api = useConfigApi();

  return useMutation({
    mutationFn: (
      configRequest: ApiPutInspectionPropertiesConfigurationRequest,
    ) => {
      return api.putInspectionPropertiesConfig(configRequest);
    },
    onSuccess: () => {
      snackbar.confirmation("Die Änderungen wurden gespeichert.");
    },
  });
}
