/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetFacilityFileStateResponse,
  ApiGetReferenceFacilityResponse,
} from "@eshg/employee-portal-api/base";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { ExternalLinkDetailsCell } from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";

export interface CentralFileFacilityDetailsProps {
  facility: ApiGetFacilityFileStateResponse | ApiGetReferenceFacilityResponse;
  columnSx?: SxProps;
}

export function CentralFileFacilityDetails(
  props: CentralFileFacilityDetailsProps,
) {
  const facility = props.facility;

  return (
    <Stack
      direction={{ md: "row" }}
      gap={3}
      divider={<ResponsiveDivider breakpoint="md" />}
    >
      <DetailsColumn sx={props.columnSx}>
        <DetailsCell name={"name"} label={"Name"} value={facility.name} />
      </DetailsColumn>
      {facility.contactAddress && (
        <BaseAddressDetails
          sx={props.columnSx}
          address={facility.contactAddress}
        />
      )}
      {facility.emailAddresses.length + facility.phoneNumbers.length > 0 && (
        <DetailsColumn sx={props.columnSx}>
          {facility.emailAddresses.map((email, index) => (
            <ExternalLinkDetailsCell
              key={`${email}.${index}`}
              name={`emailAddress.${index}`}
              label={"E-Mail-Adresse"}
              value={email}
              href={(value) => `mailto:${value}`}
            />
          ))}
          {facility.phoneNumbers.map((phoneNumber, index) => (
            <DetailsCell
              key={`${phoneNumber}.${index}`}
              name={`phoneNumber.${index}`}
              label={"Telefonnummer"}
              value={phoneNumber}
            />
          ))}
        </DetailsColumn>
      )}
    </Stack>
  );
}
