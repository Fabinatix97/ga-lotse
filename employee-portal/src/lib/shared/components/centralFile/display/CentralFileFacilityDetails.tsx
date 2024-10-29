/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { ExternalLinkDetailsCell } from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import { BaseAddress } from "@/lib/shared/helpers/address";

export interface CentralFileFacility {
  readonly name: string;
  readonly contactAddress?: BaseAddress;
  readonly emailAddresses?: string[];
  readonly phoneNumbers?: string[];
}

const fieldName = createFieldNameMapper<CentralFileFacility>();

export interface CentralFileFacilityDetailsProps<T> {
  readonly facility: T;
  readonly columnSx?: SxProps;
  readonly children?: ReactNode;
}

export function CentralFileFacilityDetails<T extends CentralFileFacility>(
  props: CentralFileFacilityDetailsProps<T>,
) {
  const facility = props.facility;

  const emailAddresses = facility.emailAddresses ?? [];
  const phoneNumbers = facility.phoneNumbers ?? [];

  return (
    <Stack
      direction={{ md: "row" }}
      gap={3}
      divider={<ResponsiveDivider breakpoint="md" />}
      width="100%"
    >
      <DetailsColumn sx={props.columnSx}>
        <DetailsCell
          name={fieldName("name")}
          label={"Name"}
          value={facility.name}
        />
        {props.children}
      </DetailsColumn>
      {facility.contactAddress && (
        <BaseAddressDetails
          sx={props.columnSx}
          address={facility.contactAddress}
        />
      )}
      {emailAddresses.length + phoneNumbers.length > 0 && (
        <DetailsColumn sx={props.columnSx}>
          {emailAddresses.map((email, index) => (
            <ExternalLinkDetailsCell
              key={`${email}.${index}`}
              name={`emailAddress.${index}`}
              label={"E-Mail-Adresse"}
              value={email}
              href={(value) => `mailto:${value}`}
            />
          ))}
          {phoneNumbers.map((phoneNumber, index) => (
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
