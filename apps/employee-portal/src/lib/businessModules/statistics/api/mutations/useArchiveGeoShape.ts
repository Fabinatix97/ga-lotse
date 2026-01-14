/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useGeoShapeApi } from "@/lib/businessModules/statistics/api/clients";

export function useArchiveGeoShape() {
  const snackbar = useSnackbar();
  const geoShapeApi = useGeoShapeApi();

  const archiveGeoShapeMutation = useHandledMutation({
    mutationFn: (geoShapeId: string) =>
      geoShapeApi.updateGeoShapeRaw({
        geoShapeId,
        apiUpdateGeoShapeRequest: {
          type: "GeoShapeChangeStatusRequest",
          status: "ARCHIVED",
        },
      }),
    onSuccess: () => snackbar.confirmation("Karte archiviert"),
  });

  return (geoShapeId: string) => archiveGeoShapeMutation.mutate(geoShapeId);
}
