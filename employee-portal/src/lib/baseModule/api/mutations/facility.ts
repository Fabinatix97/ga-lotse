/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddFacilityFileStateRequest } from "@eshg/base-api";
import { ApiDataOrigin } from "@eshg/inspection-api";
import { mapBaseAddressToApi } from "@eshg/lib-employee-portal";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { isNullish } from "remeda";

import { useFacilityApi } from "@/lib/baseModule/api/clients";
import { mapBaseFacilityToUpdate } from "@/lib/baseModule/api/mapper/facility";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { mapContactPersonToApi } from "@/lib/shared/helpers/facilityUtils";

export function useAddFacility() {
  const facilityApi = useFacilityApi();

  return useHandledMutation({
    mutationFn: async (facility: BaseFacility) => {
      const request = mapBaseFacilityToAddRequest(facility);
      return await facilityApi.addFacilityFileState(request);
    },
  });
}

function mapBaseFacilityToAddRequest(
  facility: BaseFacility,
): ApiAddFacilityFileStateRequest {
  return {
    name: facility.name.trim(),
    emailAddresses: facility.emailAddresses,
    phoneNumbers: facility.phoneNumbers,
    contactAddress: mapBaseAddressToApi(facility.contactAddress),
    differentBillingAddress: isNullish(facility.billingAddress)
      ? undefined
      : mapBaseAddressToApi(facility.billingAddress),
    contactPersons: facility.contactPersons.map(mapContactPersonToApi),
    dataOrigin: ApiDataOrigin.Manual,
  };
}

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
