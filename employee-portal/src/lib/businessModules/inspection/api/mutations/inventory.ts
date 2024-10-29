/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiErrorCode } from "@eshg/employee-portal-api/base";
import { ModifyInventoryRequest } from "@eshg/employee-portal-api/inspection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";

export function useModifyInventory() {
  const inspectionApi = useInspectionApi();
  const alert = useAlert();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: ModifyInventoryRequest) =>
      inspectionApi.modifyInventoryRaw(req).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Änderung gespeichert.");
    },
    onError: (error) => {
      const { originalErrorCode } = resolveError(error);

      if (originalErrorCode !== ApiErrorCode.DataIntegrityViolation) {
        return;
      }

      alert.error({
        title: "Inventar nicht verfügbar",
        message:
          "Das gewählte Inventar ist in der gewünschten Anzahl nicht mehr verfügbar.",
      });
    },
    onMutate: () => {
      alert.close();
    },
  });
}
