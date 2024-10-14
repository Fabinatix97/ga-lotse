/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { Grid } from "@mui/joy";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";

export function EmailAndPhoneNumbersInfoSection({
  emailAddresses,
}: Readonly<{
  emailAddresses: string[] | undefined;
}>) {
  return emailAddresses !== undefined && emailAddresses.length !== 0 ? (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} py={0} px={1}>
        {emailAddresses?.map((addr, idx) => (
          <EmailInfoTile key={addr} emailAddress={addr} index={idx} />
        ))}
      </Grid>
    </Grid>
  ) : (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} py={0} px={1}>
        <Grid xs={12} padding={1}>
          <DetailsCell name={`mail-0`} label="E-Mail-Adresse" value={"-"} />
        </Grid>
      </Grid>
    </Grid>
  );
}

function EmailInfoTile({
  emailAddress,
  index,
}: Readonly<{
  emailAddress: string;
  index: number;
}>) {
  return (
    <Grid xs={12} padding={1}>
      <DetailsCell
        name={`mail-${index}`}
        label="E-Mail-Adresse"
        value={
          <ExternalLink href={`mailto:${emailAddress}`}>
            {emailAddress}
          </ExternalLink>
        }
      />
    </Grid>
  );
}
