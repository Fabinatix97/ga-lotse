/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import {
  ExternalLinkDetailsCell,
  phoneHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";

export function PhoneNumberSection({
  phoneNumber,
  index,
}: Readonly<{
  phoneNumber: string;
  index?: number;
}>) {
  return (
    <Grid xs={12} padding={1}>
      <ExternalLinkDetailsCell
        key={[phoneNumber, index].join("-")}
        name={`phoneNumbers.${index}`}
        label={"Telefonnummer"}
        value={phoneNumber}
        href={phoneHref}
      />
    </Grid>
  );
}
