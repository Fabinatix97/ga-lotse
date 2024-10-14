/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useGeoShapeApi } from "@/lib/businessModules/statistics/api/clients";

export function useActivateGeoShape() {
  const snackbar = useSnackbar();
  const geoShapeApi = useGeoShapeApi();

  const activateGeoShapeMutation = useHandledMutation({
    mutationFn: (geoShapeId: string) =>
      geoShapeApi.updateGeoShapeRaw({
        geoShapeId,
        apiUpdateGeoShapeRequest: {
          type: "GeoShapeChangeStatusRequest",
          status: "ACTIVE",
        },
      }),
    onSuccess: () => snackbar.confirmation("Archivierung aufgehoben"),
  });

  return (geoShapeId: string) => activateGeoShapeMutation.mutate(geoShapeId);
}
