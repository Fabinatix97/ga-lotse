/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUpdateReferenceFacilityRequest } from "@eshg/base-api";
import { mapBaseAddressToApi } from "@eshg/lib-employee-portal";
import { dropBlankStrings } from "@eshg/lib-portal";

import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapContactPersonToApi } from "@/lib/shared/helpers/facilityUtils";

export function mapBaseFacilityToUpdate(
  facility: DefaultFacilityFormValues,
  version: number,
): ApiUpdateReferenceFacilityRequest {
  return {
    facilityDetails: {
      name: facility.name,
      contactAddress: mapBaseAddressToApi(facility.contactAddress),
      differentBillingAddress: mapBaseAddressToApi(
        facility.differentBillingAddress,
      ),
      contactPersons: facility.contactPersons.map(mapContactPersonToApi),
      phoneNumbers: dropBlankStrings(facility.phoneNumbers),
      emailAddresses: dropBlankStrings(facility.emailAddresses),
    },
    version,
  };
}
