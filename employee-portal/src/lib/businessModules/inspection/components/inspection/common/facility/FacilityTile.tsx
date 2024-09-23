/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDomesticAddress,
  ApiInspFacility,
  ApiPostboxAddress,
} from "@eshg/employee-portal-api/inspection";
import { Grid } from "@mui/joy";
import { isNonNullish } from "remeda";

import { EmailAndPhoneNumbersSection } from "@/lib/businessModules/inspection/components/inspection/common/EmailAndPhoneNumbersSection";
import { TileDivider } from "@/lib/businessModules/inspection/components/inspection/common/TileDivider";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { streetAndHouseNumber } from "@/lib/shared/helpers/facilityUtils";
import { translateCountry } from "@/lib/shared/helpers/i18n";

interface FacilityTileProps {
  facility: ApiInspFacility;
  setOpen: (initialState: boolean) => void;
  readonly?: boolean;
}

export function FacilityTile({
  facility,
  setOpen,
  readonly,
}: Readonly<FacilityTileProps>) {
  const address = facility.baseFacility.contactAddress;
  return (
    <InfoTile
      name="facility"
      title="Einrichtung"
      onEdit={!readonly ? () => setOpen(true) : undefined}
    >
      <Grid container spacing={3}>
        <Grid xs={4}>
          <Grid xs={12}>
            <Grid container direction="column" sx={{ gap: 2 }}>
              <DetailsCell
                name="name"
                label="Name"
                value={facility.baseFacility.name}
              />
              {facility.objectType && (
                <DetailsCell
                  name="Objekttyp"
                  label="Objekttyp"
                  value={facility.objectType?.name}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        <TileDivider />
        {address?.type === "DomesticAddress" && (
          <DomesticAddressSection address={address} />
        )}
        {address?.type === "PostboxAddress" && (
          <PostBoxAddressSection address={address} />
        )}
        <TileDivider />
        <EmailAndPhoneNumbersSection
          emailAddresses={facility.baseFacility.emailAddresses}
          phoneNumbers={facility.baseFacility.phoneNumbers}
        />
      </Grid>
    </InfoTile>
  );
}

function DomesticAddressSection({
  address,
}: Readonly<{
  address: ApiDomesticAddress;
}>) {
  return (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} padding={0}>
        <Grid xs={12}>
          <DetailsCell
            name="street"
            label="Straße und Haus-Nr."
            value={streetAndHouseNumber(address)}
          />
        </Grid>
        <Grid xs={12}>
          <Grid container spacing={3}>
            <Grid xs={6}>
              <DetailsCell
                name="postalCode"
                label="Postleitzahl"
                value={address.postalCode}
              />
            </Grid>
            <Grid xs={8}>
              <DetailsCell name="city" label="Ort" value={address.city} />
            </Grid>
          </Grid>
        </Grid>
        {isNonNullish(address.addressAddition) && (
          <Grid xs={12}>
            <DetailsCell
              name="addressAddition"
              label="Adresszusatz"
              value={address.addressAddition}
            />
          </Grid>
        )}
        <Grid xs={12}>
          <DetailsCell
            name="country"
            label="Land"
            value={translateCountry(address.country)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

function PostBoxAddressSection({
  address,
}: Readonly<{
  address: ApiPostboxAddress;
}>) {
  return (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} padding={0}>
        <Grid xs={12}>
          <DetailsCell
            name="postBoxLabel"
            label="Postfach"
            value={address.postbox}
          />
        </Grid>
        <Grid xs={12}>
          <Grid container spacing={3}>
            <Grid xs={6}>
              <DetailsCell
                name="postalCode"
                label="Postleitzahl"
                value={address.postalCode}
              />
            </Grid>
            <Grid xs={8}>
              <DetailsCell name="city" label="Ort" value={address.city} />
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="country"
            label="Land"
            value={translateCountry(address.country)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
