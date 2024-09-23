/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import { EmailSection } from "./EmailSection";
import { PhoneNumberSection } from "./PhoneNumberSection";

export function EmailAndPhoneNumbersSection({
  emailAddresses,
  phoneNumbers,
}: Readonly<{
  emailAddresses: string[];
  phoneNumbers: string[];
}>) {
  return (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} padding={0}>
        {emailAddresses.map((addr, idx) => (
          <EmailSection key={addr} emailAddress={addr} index={idx} />
        ))}
        {phoneNumbers.map((phone, idx) => (
          <PhoneNumberSection key={phone} phoneNumber={phone} index={idx} />
        ))}
      </Grid>
    </Grid>
  );
}
