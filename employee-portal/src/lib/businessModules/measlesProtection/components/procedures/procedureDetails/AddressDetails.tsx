/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDomesticAddress,
  ApiPostboxAddress,
} from "@eshg/employee-portal-api/measlesProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { Stack } from "@mui/joy";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { BaseAddress } from "@/lib/shared/helpers/address";
import { translateCountry } from "@/lib/shared/helpers/i18n";

interface AddressDetailsProps {
  address?: BaseAddress;
}

export function AddressDetails({ address }: AddressDetailsProps) {
  if (address == null) {
    return null;
  }

  if (address.type === "PostboxAddress") {
    return PostboxAddressDetails(address);
  } else {
    return DomesticAddressDetails(address);
  }
}

function streetAndHouseNumber(street: string, houseNumber?: string): string {
  return houseNumber != null ? street + " " + houseNumber : street;
}

function DomesticAddressDetails(address: ApiDomesticAddress) {
  return (
    <Stack gap={1}>
      <DetailsCell
        label="Straße und Haus Nr."
        value={streetAndHouseNumber(address.street, address.houseNumber)}
      />
      <DetailsCell label="Adresszusatz" value={address.addressAddition} />
      <Row columnGap={3} justifyContent="start">
        <DetailsCell label="Postleitzahl" value={address.postalCode} />
        <DetailsCell label="Ort" value={address.city} />
      </Row>
      <DetailsCell label="Land" value={translateCountry(address.country)} />
    </Stack>
  );
}

function PostboxAddressDetails(address: ApiPostboxAddress) {
  return (
    <Stack gap={1}>
      <DetailsCell label="Postfach" value={address.postbox} />
      <Row columnGap={3} justifyContent="start">
        <DetailsCell label="Postleitzahl" value={address.postalCode} />
        <DetailsCell label="Ort" value={address.city} />
      </Row>
      <DetailsCell label="Land" value={translateCountry(address.country)} />
    </Stack>
  );
}
