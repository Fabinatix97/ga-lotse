/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode, ApiGender, ApiSalutation } from "@eshg/base-api";
import {
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
} from "@eshg/lib-portal/components/formFields/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { GENDER_VALUES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { ExternalLinkDetailsCell } from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import { BaseAddress } from "@/lib/shared/helpers/address";

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

const fieldName = createFieldNameMapper<CentralFilePerson>();

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
              <DetailsCell
                name={fieldName("salutation")}
                label={PERSON_FIELD_NAME.salutation}
                value={SALUTATION_VALUES[person.salutation]}
              />
            )}
            <DetailsCell
              name={fieldName("title")}
              label={PERSON_FIELD_NAME.title}
              value={person.title}
            />
          </DetailsRow>
        )}
        <DetailsCell
          name={fieldName("firstName")}
          label={PERSON_FIELD_NAME.firstName}
          value={person.firstName}
        />
        <DetailsCell
          name={fieldName("lastName")}
          label={PERSON_FIELD_NAME.lastName}
          value={person.lastName}
        />
        <DetailsRow>
          <DetailsCell
            name={fieldName("dateOfBirth")}
            label={PERSON_FIELD_NAME.dateOfBirth}
            value={formatDate(person.dateOfBirth)}
          />
          {props.showAge && (
            <DetailsCell
              name="currentAge"
              label="Alter"
              value={calculateAge(person.dateOfBirth)}
            />
          )}
          {isDefined(person.gender) && (
            <DetailsCell
              name={fieldName("gender")}
              label={PERSON_FIELD_NAME.gender}
              value={GENDER_VALUES[person.gender]}
            />
          )}
        </DetailsRow>
        <DetailsCell
          name={fieldName("nameAtBirth")}
          label={PERSON_FIELD_NAME.nameAtBirth}
          value={person.nameAtBirth}
        />
        {(person.placeOfBirth ?? person.countryOfBirth) && (
          <DetailsRow>
            <DetailsCell
              name={fieldName("placeOfBirth")}
              label={PERSON_FIELD_NAME.placeOfBirth}
              value={person.placeOfBirth}
            />
            {person.countryOfBirth && (
              <DetailsCell
                name={fieldName("countryOfBirth")}
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
      {emailAddresses.length + phoneNumbers.length > 0 && (
        <DetailsColumn sx={props.columnSx}>
          {emailAddresses.map((email, index) => (
            <ExternalLinkDetailsCell
              key={`${email}.${index}`}
              name={`emailAddress.${index}`}
              label={PERSON_FIELD_NAME.emailAddresses}
              value={email}
              href={(value) => `mailto:${value}`}
            />
          ))}
          {phoneNumbers.map((phoneNumber, index) => (
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
