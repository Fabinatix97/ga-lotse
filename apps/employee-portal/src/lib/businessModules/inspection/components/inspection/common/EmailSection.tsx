/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import {
  ExternalLinkDetailsItem,
  emailHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsItem";

export function EmailSection({
  emailAddress,
  index,
}: Readonly<{
  emailAddress: string;
  index?: number;
}>) {
  return (
    <Grid xs={12} paddingInline={0}>
      <ExternalLinkDetailsItem
        key={[emailAddress, index].join("-")}
        label="E-Mail-Adresse"
        value={emailAddress}
        href={emailHref}
      />
    </Grid>
  );
}
