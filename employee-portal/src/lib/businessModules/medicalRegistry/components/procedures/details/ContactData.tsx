/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import {
  ExternalLinkDetailsCell,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import { PERSON_FIELD_NAME } from "@/lib/shared/components/personSidebar/constants";

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
        <ExternalLinkDetailsCell
          key={emailAddress}
          label={PERSON_FIELD_NAME.emailAddresses}
          value={emailAddress}
          href={emailHref}
        />
      ))}
      {phoneNumbers.map((phoneNumber) => (
        <DetailsCell
          key={phoneNumber}
          label={PERSON_FIELD_NAME.phoneNumbers}
          value={phoneNumber}
        />
      ))}
    </>
  );
}
