/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/employee-portal-api/measlesProtection";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";

import { facilityTypeNames } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";
import {
  LabeledValue,
  ValueList,
} from "@/lib/shared/components/detailsCard/LabeledValue";

import { AddressDetails } from "./AddressDetails";
import { FacilityContactDetails } from "./ContactDetails";
import { FacilityContacts } from "./FacilityContact";

export function Facility({
  procedure,
}: {
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}) {
  if (!procedure?.facility) {
    return null;
  }

  const facility = procedure.facility;

  return (
    procedure.facility && (
      <>
        <DetailsCard title="Einrichtung">
          <ValueList>
            <LabeledValue label="Name" value={facility.name} />
            <LabeledValue
              label="Einrichtungsart"
              value={facilityTypeNames[facility.type]}
            />
            {isNonEmptyString(facility.otherFacilityTypeInformation) && (
              <LabeledValue
                label="Anderer Einrichtungstyp"
                value={facility.otherFacilityTypeInformation}
              />
            )}
          </ValueList>
          <AddressDetails address={facility.contactAddress} />
          <FacilityContactDetails facility={procedure.facility} />
        </DetailsCard>
        <FacilityContacts persons={facility.contactPersons} />
      </>
    )
  );
}
