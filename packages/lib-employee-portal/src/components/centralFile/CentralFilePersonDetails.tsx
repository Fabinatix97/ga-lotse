/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode, ApiGender, ApiSalutation } from "@eshg/base-api";
import {
  GENDER_VALUES,
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
} from "@eshg/lib-portal/components/formFields/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { BaseAddress } from "@/api/models/address";
import { ResponsiveDivider } from "@/components/ResponsiveDivider";
import { BaseAddressDetailsColumn } from "@/components/address/BaseAddressDetailsColumn";
import { DetailsColumn } from "@/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/components/detailsSection/DetailsRow";
import { DetailsItem } from "@/components/detailsSection/items/DetailsItem";
import { ExternalLinkDetailsItem } from "@/components/detailsSection/items/ExternalLinkDetailsItem";

export interface CentralFilePerson {
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: Date;
  readonly gender?: ApiGender;
  readonly title?: string;
  readonly salutation?: ApiSalutation;
  readonly nameAtBirth?: string;
  readonly placeOfBirth?: string;
  readonly countryOfBirth?: ApiCountryCode;
  readonly emailAddresses?: string[];
  readonly phoneNumbers?: string[];
  readonly contactAddress?: BaseAddress;
}

export interface CentralFilePersonDetailsProps {
  readonly person: CentralFilePerson;
  readonly columnSx?: SxProps;
  readonly showAge?: boolean;
}

export function CentralFilePersonDetails(props: CentralFilePersonDetailsProps) {
  const person = props.person;

  const emailAddresses = person.emailAddresses ?? [];
  const phoneNumbers = person.phoneNumbers ?? [];

  return (
    <Stack
      direction={{ md: "row" }}
      gap={3}
      divider={<ResponsiveDivider breakpoint="md" />}
      width="100%"
    >
      <DetailsColumn sx={props.columnSx}>
        {(isDefined(person.salutation) || isDefined(person.title)) && (
          <DetailsRow>
            {isDefined(person.salutation) && (
              <DetailsItem
                label={PERSON_FIELD_NAME.salutation}
                value={SALUTATION_VALUES[person.salutation]}
              />
            )}
            <DetailsItem label={PERSON_FIELD_NAME.title} value={person.title} />
          </DetailsRow>
        )}
        <DetailsItem
          label={PERSON_FIELD_NAME.firstName}
          value={person.firstName}
        />
        <DetailsItem
          label={PERSON_FIELD_NAME.lastName}
          value={person.lastName}
        />
        <DetailsRow>
          <DetailsItem
            label={PERSON_FIELD_NAME.dateOfBirth}
            value={formatDate(person.dateOfBirth)}
          />
          {props.showAge && (
            <DetailsItem
              label="Alter"
              value={calculateAge(person.dateOfBirth)}
            />
          )}
          {isDefined(person.gender) && (
            <DetailsItem
              label={PERSON_FIELD_NAME.gender}
              value={GENDER_VALUES[person.gender]}
            />
          )}
        </DetailsRow>
        <DetailsItem
          label={PERSON_FIELD_NAME.nameAtBirth}
          value={person.nameAtBirth}
        />
        {(person.placeOfBirth ?? person.countryOfBirth) && (
          <DetailsRow>
            <DetailsItem
              label={PERSON_FIELD_NAME.placeOfBirth}
              value={person.placeOfBirth}
            />
            {person.countryOfBirth && (
              <DetailsItem
                label={PERSON_FIELD_NAME.countryOfBirth}
                value={translateCountry(person.countryOfBirth)}
              />
            )}
          </DetailsRow>
        )}
      </DetailsColumn>
      {person.contactAddress && (
        <BaseAddressDetailsColumn
          sx={props.columnSx}
          address={person.contactAddress}
        />
      )}
      {emailAddresses.length + phoneNumbers.length > 0 && (
        <DetailsColumn sx={props.columnSx}>
          {emailAddresses.map((email, index) => (
            <ExternalLinkDetailsItem
              key={`${email}.${index}`}
              label={PERSON_FIELD_NAME.emailAddresses}
              value={email}
              href={(value) => `mailto:${value}`}
            />
          ))}
          {phoneNumbers.map((phoneNumber, index) => (
            <DetailsItem
              key={`${phoneNumber}.${index}`}
              label={PERSON_FIELD_NAME.phoneNumbers}
              value={phoneNumber}
            />
          ))}
        </DetailsColumn>
      )}
    </Stack>
  );
}
