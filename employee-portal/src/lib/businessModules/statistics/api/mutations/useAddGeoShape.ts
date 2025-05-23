/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  mapRequiredValue,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

import { useGeoShapeApi } from "@/lib/businessModules/statistics/api/clients";
import { AddGeoShapeValues } from "@/lib/businessModules/statistics/components/geoshapes/ImportGeoShapeSidebar/ImportGeoShapeSidebar";

export function useAddGeoShape() {
  const snackbar = useSnackbar();
  const geoShapeApi = useGeoShapeApi();

  const addGeoShapeMutation = useHandledMutation({
    mutationFn: (values: AddGeoShapeValues) =>
      geoShapeApi.addGeoShapeRaw({
        title: values.title.trim(),
        file: mapRequiredValue(values.file),
      }),
    onSuccess: () => snackbar.confirmation("Karte erfolgreich importiert"),
  });
  return async (
    param: AddGeoShapeValues,
    options: { onSuccess?: () => void },
  ) => {
    await addGeoShapeMutation.mutateAsync(param, {
      onSuccess: options.onSuccess,
    });
  };
}
