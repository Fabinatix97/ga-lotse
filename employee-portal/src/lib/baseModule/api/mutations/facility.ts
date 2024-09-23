/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddFacilityFileStateRequest } from "@eshg/employee-portal-api/base";
import { ApiDataOrigin } from "@eshg/employee-portal-api/inspection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { isNullish } from "remeda";

import { useFacilityApi } from "@/lib/baseModule/api/clients";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { mapBaseAddressToApi } from "@/lib/shared/components/form/address/helpers";
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
