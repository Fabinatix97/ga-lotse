/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import {
  ExternalLinkDetailsItem,
  phoneHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsItem";

export function PhoneNumberSection({
  phoneNumber,
  index,
}: Readonly<{
  phoneNumber: string;
  index?: number;
}>) {
  return (
    <Grid xs={12} paddingInline={0}>
      <ExternalLinkDetailsItem
        key={[phoneNumber, index].join("-")}
        label="Telefonnummer"
        value={phoneNumber}
        href={phoneHref}
      />
    </Grid>
  );
}
