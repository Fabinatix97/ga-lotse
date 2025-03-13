/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiFacilityContactPerson } from "@eshg/base-api";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { isNonEmptyArray } from "@eshg/lib-portal/helpers/guards";
import { Chip, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { ExternalLinkDetailsItem } from "@/lib/shared/components/detailsSection/items/ExternalLinkDetailsItem";
import { BaseAddress } from "@/lib/shared/helpers/address";

export interface CentralFileFacility {
  readonly name: string;
  readonly contactAddress?: BaseAddress;
  readonly emailAddresses?: string[];
  readonly phoneNumbers?: string[];
  readonly contactPersons?: ApiFacilityContactPerson[];
}

export interface CentralFileFacilityDetailsProps<T> {
  readonly facility: T;
  readonly columnSx?: SxProps;
  readonly children?: ReactNode;
  readonly showContactPersonChip?: boolean;
}

export function CentralFileFacilityDetails<T extends CentralFileFacility>(
  props: CentralFileFacilityDetailsProps<T>,
) {
  const facility = props.facility;

  const emailAddresses = facility.emailAddresses ?? [];
  const phoneNumbers = facility.phoneNumbers ?? [];
  const contactPersons = facility.contactPersons ?? [];
  const mainContact = contactPersons.find(
    (contact) => contact.mainContact === true,
  );
  const showContactPersonChip = props.showContactPersonChip ?? false;

  return (
    <Stack
      direction={{ md: "row" }}
      gap={3}
      divider={<ResponsiveDivider breakpoint="md" />}
      width="100%"
    >
      <DetailsColumn sx={props.columnSx}>
        <DetailsItem label="Name" value={facility.name} />
        {props.children}
      </DetailsColumn>
      {facility.contactAddress && (
        <BaseAddressDetails
          sx={props.columnSx}
          address={facility.contactAddress}
        />
      )}
      {isNonEmptyArray(contactPersons) && isDefined(mainContact) ? (
        <DetailsColumn sx={props.columnSx}>
          <MainContactDetails
            contactPersons={contactPersons}
            mainContact={mainContact}
          />
        </DetailsColumn>
      ) : (
        emailAddresses.length + phoneNumbers.length > 0 && (
          <DetailsColumn sx={props.columnSx}>
            {emailAddresses.map((email, index) => (
              <ExternalLinkDetailsItem
                key={`${email}.${index}`}
                label="E-Mail-Adresse"
                value={email}
                href={(value) => `mailto:${value}`}
              />
            ))}
            {phoneNumbers.map((phoneNumber, index) => (
              <DetailsItem
                key={`${phoneNumber}.${index}`}
                label="Telefonnummer"
                value={phoneNumber}
              />
            ))}
            {showContactPersonChip && contactPersons?.length >= 1 && (
              <Chip
                color="primary"
                variant="solid"
              >{`${contactPersons.length} ${contactPersons.length === 1 ? "Kontaktperson" : "Kontaktpersonen"}`}</Chip>
            )}
          </DetailsColumn>
        )
      )}
    </Stack>
  );
}

interface MainContactDetailsProps {
  contactPersons: ApiFacilityContactPerson[];
  mainContact: ApiFacilityContactPerson;
}

function MainContactDetails({
  contactPersons,
  mainContact,
}: Readonly<MainContactDetailsProps>) {
  return (
    <>
      <DetailsItem
        label="Kontaktperson"
        value={formatPersonName(mainContact)}
      />
      <ExternalLinkDetailsItem
        label="E-Mail-Adresse"
        value={mainContact.emailAddress}
        href={(value) => `mailto:${value}`}
      />
      <DetailsItem label="Telefonnummer" value={mainContact.phoneNumber} />
      {contactPersons.length > 1 && (
        <Chip
          color="primary"
          variant="solid"
        >{`+ ${contactPersons.length - 1} ${contactPersons.length - 1 === 1 ? "Kontaktperson" : "Kontaktpersonen"}`}</Chip>
      )}
    </>
  );
}
