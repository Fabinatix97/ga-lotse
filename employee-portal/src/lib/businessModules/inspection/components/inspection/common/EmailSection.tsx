/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import {
  ExternalLinkDetailsCell,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";

export function EmailSection({
  emailAddress,
  index,
}: Readonly<{
  emailAddress: string;
  index?: number;
}>) {
  return (
    <Grid xs={12} padding={1}>
      <ExternalLinkDetailsCell
        key={[emailAddress, index].join("-")}
        name={`emailAddresses.${index}`}
        label={"E-Mail-Adresse"}
        value={emailAddress}
        href={emailHref}
      />
    </Grid>
  );
}
