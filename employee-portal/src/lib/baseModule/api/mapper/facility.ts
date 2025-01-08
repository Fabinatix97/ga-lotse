/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUpdateReferenceFacilityRequest } from "@eshg/employee-portal-api/base";
import { dropBlankStrings } from "@eshg/lib-portal/helpers/form";

import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapBaseAddressToApi } from "@/lib/shared/components/form/address/helpers";
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
