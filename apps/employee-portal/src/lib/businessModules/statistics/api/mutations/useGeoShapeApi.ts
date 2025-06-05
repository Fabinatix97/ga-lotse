/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapRequiredValue, useHandledMutation } from "@eshg/lib-portal";

import { useGeoShapeApi } from "@/lib/businessModules/statistics/api/clients";
import { AddGeoShapeValues } from "@/lib/businessModules/statistics/components/geoshapes/ImportGeoShapeSidebar/ImportGeoShapeSidebar";

export function useAddGeoShape() {
  const geoShapeApi = useGeoShapeApi();
  return useHandledMutation({
    mutationFn: (values: AddGeoShapeValues) =>
      geoShapeApi.addGeoShapeRaw({
        ...values,
        file: mapRequiredValue(values.file),
      }),
  });
}
