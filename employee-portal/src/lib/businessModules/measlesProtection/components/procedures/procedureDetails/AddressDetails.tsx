/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDomesticAddress,
  ApiPostboxAddress,
} from "@eshg/employee-portal-api/measlesProtection";

import { Row } from "@/lib/shared/Row";
import { BaseAddress } from "@/lib/shared/helpers/address";
import { translateCountry } from "@/lib/shared/helpers/i18n";

import { LabeledValue, ValueList } from "./LabeledValue";

interface AddressDetailsProps {
  address?: BaseAddress;
}

export function AddressDetails({ address }: AddressDetailsProps) {
  if (address == null) {
    return <ValueList></ValueList>;
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
    <ValueList>
      <LabeledValue
        label="Straße und Haus Nr."
        value={streetAndHouseNumber(address.street, address.houseNumber)}
      />
      <LabeledValue label="Adresszusatz" value={address.addressAddition} />
      <Row columnGap={3} justifyContent="start">
        <LabeledValue label="Postleitzahl" value={address.postalCode} />
        <LabeledValue label="Ort" value={address.city} />
      </Row>
      <LabeledValue label="Land" value={translateCountry(address.country)} />
    </ValueList>
  );
}

function PostboxAddressDetails(address: ApiPostboxAddress) {
  return (
    <ValueList>
      <LabeledValue label="Postfach" value={address.postbox} />
      <Row columnGap={3} justifyContent="start">
        <LabeledValue label="Postleitzahl" value={address.postalCode} />
        <LabeledValue label="Ort" value={address.city} />
      </Row>
      <LabeledValue label="Land" value={translateCountry(address.country)} />
    </ValueList>
  );
}
