/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TaggedDomesticAddress,
  TaggedPostboxAddress,
} from "@/lib/shared/helpers/address";

export const BASE_ADDRESS_FIELD_NAME = {
  type: "Art",
  differentName: "Abweichender Empfänger",
  streetAndHouseNumber: "Straße und Haus-Nr.",
  street: "Straße",
  houseNumber: "Haus-Nr.",
  city: "Ort",
  country: "Land",
  postbox: "Postfachnummer",
  postalCode: "Postleitzahl",
  addressAddition: "Adresszusatz",
} as const satisfies Record<
  keyof TaggedDomesticAddress | keyof TaggedPostboxAddress,
  string
> & {
  streetAndHouseNumber: "Straße und Haus-Nr.";
};
