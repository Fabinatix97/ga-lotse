/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPatient } from "@eshg/employee-portal-api/travelMedicine";
import { Grid } from "@mui/joy";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { translateCountry } from "@/lib/shared/helpers/i18n";

export function DomesticAddressInfoSection({
  patient,
}: Readonly<{ patient: ApiPatient }>) {
  return (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} py={0} px={1}>
        <Grid xs={12}>
          <DetailsCell
            name="street"
            label="Straße und Haus-Nr."
            value={
              patient.address?.street !== undefined &&
              patient.address?.houseNumber !== undefined
                ? [patient.address?.street, patient.address?.houseNumber]
                    .join(" ")
                    .trim()
                : "-"
            }
          />
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="addressAddition"
            label="Adresszusatz"
            value={patient.address?.addressAddition ?? "-"}
          />
        </Grid>
        <Grid xs={12}>
          <Grid container spacing={3}>
            <Grid xs={6}>
              <DetailsCell
                name="postalCode"
                label="Postleitzahl"
                value={patient.address?.postalCode ?? "-"}
              />
            </Grid>
            <Grid xs={8}>
              <DetailsCell
                name="city"
                label="Ort"
                value={patient.address?.city ?? "-"}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="country"
            label="Land"
            value={
              patient.address?.country !== undefined
                ? translateCountry(patient.address?.country)
                : "-"
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
