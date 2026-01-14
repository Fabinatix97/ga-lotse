/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useFacilityApi } from "@/lib/baseModule/api/clients";
import { mapBaseFacilityToUpdate } from "@/lib/baseModule/api/mapper/facility";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";

export function useUpdateReferenceFacility(id: string, version: number) {
  const facilityApi = useFacilityApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (facility: DefaultFacilityFormValues) => {
      const request = mapBaseFacilityToUpdate(facility, version);
      await facilityApi.updateReferenceFacility(id, request);
    },
    onSuccess: () => snackbar.confirmation("Einrichtung wurde gespeichert."),
  });
}
