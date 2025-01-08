/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/employee-portal-api/measlesProtection";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Sheet } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { facilityTypeNames } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

import { FacilityContacts } from "./FacilityContact";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

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
        <Sheet>
          <DetailsSection title="Einrichtung">
            <CentralFileFacilityDetails
              facility={{
                ...procedure.facility,
                // TODO: The API type here is wrong, these should both be lists
                emailAddresses: isNonEmptyString(
                  procedure.facility.emailAddress,
                )
                  ? [procedure.facility.emailAddress]
                  : [],
                phoneNumbers: isNonEmptyString(procedure.facility.phoneNumber)
                  ? [procedure.facility.phoneNumber]
                  : [],
              }}
              columnSx={COLUMN_STYLE}
            >
              <DetailsCell
                name="type"
                label="Einrichtungsart"
                value={facilityTypeNames[facility.type]}
              />
              <DetailsCell
                name="extra_type"
                label="Anderer Einrichtungstyp"
                value={facility.otherFacilityTypeInformation}
              />
            </CentralFileFacilityDetails>
          </DetailsSection>
        </Sheet>
        <FacilityContacts persons={facility.contactPersons} />
      </>
    )
  );
}
