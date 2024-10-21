/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAffectedPerson,
  ApiCustodian,
  ApiFacility,
} from "@eshg/employee-portal-api/measlesProtection";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { isNonNullish } from "remeda";

import {
  LabeledValue,
  ValueList,
} from "@/lib/shared/components/detailsCard/LabeledValue";

export function ContactDetails({
  persons,
}: {
  readonly persons: Partial<ApiCustodian | ApiAffectedPerson>[];
}) {
  const emailAddresses = persons
    .map((contact) => contact.emailAddresses)
    .flatMap((email) => email)
    .filter((item) => isNonNullish(item) && isNonEmptyString(item));

  const phoneNumbers = persons
    .map((contact) => contact.phoneNumbers)
    .flatMap((email) => email)
    .filter((item) => isNonNullish(item) && isNonEmptyString(item));

  return (
    <ValueList>
      {emailAddresses.map((email, index) => (
        <LabeledValue
          key={`Email${email}${index}`}
          label="E-Mail-Adresse"
          value={email}
          href={`mailto:${email}`}
        />
      ))}
      {phoneNumbers.map((phoneNumber, index) => (
        <LabeledValue
          key={`PhoneNumber${phoneNumber}${index}`}
          label="Telefonnummer"
          value={phoneNumber}
          href={`tel:${phoneNumber}`}
        />
      ))}
    </ValueList>
  );
}

export function FacilityContactDetails({
  facility,
}: {
  readonly facility?: ApiFacility;
}) {
  return (
    <ValueList>
      <LabeledValue
        label="E-Mail-Adresse"
        value={facility?.emailAddress}
        href={`mailto:${facility?.emailAddress}`}
      />
      <LabeledValue
        label="Telefonnummer"
        value={facility?.phoneNumber}
        href={`tel:${facility?.phoneNumber}`}
      />
    </ValueList>
  );
}
