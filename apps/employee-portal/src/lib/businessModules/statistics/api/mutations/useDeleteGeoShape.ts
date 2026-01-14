/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useGeoShapeApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteGeoShape() {
  const snackbar = useSnackbar();
  const geoShapeApi = useGeoShapeApi();

  const deleteGeoShapeMutation = useHandledMutation({
    mutationFn: (geoShapeId: string) => geoShapeApi.deleteGeoShape(geoShapeId),
    onSuccess: () => snackbar.confirmation("Geo-Shapes gelöscht"),
  });
  return (geoShapeId: string) => deleteGeoShapeMutation.mutate(geoShapeId);
}
