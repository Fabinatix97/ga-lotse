/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { ApiErrorCode } from "@eshg/base-api";
import { ModifyInventoryRequest } from "@eshg/inspection-api";
import {
  resolveError,
  unwrapRawResponse,
  useAlert,
  useSnackbar,
} from "@eshg/lib-portal";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";

export function useModifyInventory() {
  const inspectionApi = useInspectionApi();
  const alert = useAlert();
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: (req: ModifyInventoryRequest) =>
      inspectionApi.modifyInventoryRaw(req).then(unwrapRawResponse),
    onMutate: () => {
      alert.close();
    },
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
  });
}
