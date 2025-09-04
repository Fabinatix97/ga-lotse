/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DetailsItem } from "@eshg/lib-employee-portal";
import { PERSON_FIELD_NAME } from "@eshg/lib-portal";

import {
  ExternalLinkDetailsItem,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsItem";

interface ContactDataProps {
  subject: {
    emailAddresses: string[];
    phoneNumbers: string[];
  };
}

export function ContactData({ subject }: ContactDataProps) {
  const { emailAddresses, phoneNumbers } = subject;
  return (
    <>
      {emailAddresses.map((emailAddress) => (
        <ExternalLinkDetailsItem
          key={emailAddress}
          label={PERSON_FIELD_NAME.emailAddresses}
          value={emailAddress}
          href={emailHref}
        />
      ))}
      {phoneNumbers.map((phoneNumber) => (
        <DetailsItem
          key={phoneNumber}
          label={PERSON_FIELD_NAME.phoneNumbers}
          value={phoneNumber}
        />
      ))}
    </>
  );
}
