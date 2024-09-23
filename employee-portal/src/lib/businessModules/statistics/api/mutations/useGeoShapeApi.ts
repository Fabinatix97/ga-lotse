/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";

import { useGeoShapeApi } from "@/lib/businessModules/statistics/api/clients";
import { AddGeoShapeValues } from "@/lib/businessModules/statistics/components/geoshapes/ImportGeoShapesSidebar";

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
