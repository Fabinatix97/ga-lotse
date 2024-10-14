/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetPersonFileStateResponse,
  ApiGetReferencePersonResponse,
} from "@eshg/employee-portal-api/base";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { GENDER_VALUES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { ExternalLinkDetailsCell } from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import {
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
} from "@/lib/shared/components/personSidebar/constants";
import { translateCountry } from "@/lib/shared/helpers/i18n";

export interface CentralFilePersonDetailsProps {
  person: ApiGetPersonFileStateResponse | ApiGetReferencePersonResponse;
  columnSx?: SxProps;
}

export function CentralFilePersonDetails(props: CentralFilePersonDetailsProps) {
  const person = props.person;

  return (
    <Stack
      direction={{ md: "row" }}
      gap={3}
      divider={<ResponsiveDivider breakpoint="md" />}
    >
      <DetailsColumn sx={props.columnSx}>
        <DetailsRow>
          <DetailsCell
            name="salutation"
            label={PERSON_FIELD_NAME.salutation}
            value={SALUTATION_VALUES[person.salutation]}
          />
          <DetailsCell
            name="title"
            label={PERSON_FIELD_NAME.title}
            value={person.title}
          />
        </DetailsRow>
        <DetailsCell
          name="firstName"
          label={PERSON_FIELD_NAME.firstName}
          value={person.firstName}
        />
        <DetailsCell
          name="lastName"
          label={PERSON_FIELD_NAME.lastName}
          value={person.lastName}
        />
        <DetailsRow>
          <DetailsCell
            name="dateOfBirth"
            label={PERSON_FIELD_NAME.dateOfBirth}
            value={formatDate(person.dateOfBirth)}
          />
          <DetailsCell
            name="gender"
            label={PERSON_FIELD_NAME.gender}
            value={GENDER_VALUES[person.gender]}
          />
        </DetailsRow>
        <DetailsCell
          name="nameAtBirth"
          label={PERSON_FIELD_NAME.nameAtBirth}
          value={person.nameAtBirth}
        />
        {(person.placeOfBirth ?? person.countryOfBirth) && (
          <DetailsRow>
            <DetailsCell
              name="placeOfBirth"
              label={PERSON_FIELD_NAME.placeOfBirth}
              value={person.placeOfBirth}
            />
            {person.countryOfBirth && (
              <DetailsCell
                name="countryOfBirth"
                label={PERSON_FIELD_NAME.countryOfBirth}
                value={translateCountry(person.countryOfBirth)}
              />
            )}
          </DetailsRow>
        )}
      </DetailsColumn>
      {person.contactAddress && (
        <BaseAddressDetails
          sx={props.columnSx}
          address={person.contactAddress}
        />
      )}
      {person.emailAddresses.length + person.phoneNumbers.length > 0 && (
        <DetailsColumn sx={props.columnSx}>
          {person.emailAddresses.map((email, index) => (
            <ExternalLinkDetailsCell
              key={`${email}.${index}`}
              name={`emailAddress.${index}`}
              label={PERSON_FIELD_NAME.emailAddresses}
              value={email}
              href={(value) => `mailto:${value}`}
            />
          ))}
          {person.phoneNumbers.map((phoneNumber, index) => (
            <DetailsCell
              key={`${phoneNumber}.${index}`}
              name={`phoneNumber.${index}`}
              label={PERSON_FIELD_NAME.phoneNumbers}
              value={phoneNumber}
            />
          ))}
        </DetailsColumn>
      )}
    </Stack>
  );
}
