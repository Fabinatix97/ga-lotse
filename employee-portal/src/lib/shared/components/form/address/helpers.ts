/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode } from "@eshg/employee-portal-api/base";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { isNullish } from "remeda";

import { BaseAddress, BaseAddressType } from "@/lib/shared/helpers/address";

export interface BaseAddressFormInputs {
  type: BaseAddressType;
  postbox: string;
  street: string;
  houseNumber: string;
  addressAddition: string;
  differentName: string;
  postalCode: string;
  city: string;
  country: ApiCountryCode;
}

export function createEmptyAddress(): BaseAddressFormInputs {
  return {
    type: "DomesticAddress",
    street: "",
    houseNumber: "",
    addressAddition: "",
    postbox: "",
    differentName: "",
    postalCode: "",
    city: "",
    country: "DE",
  };
}

export function mapBaseAddressToApi(
  address: BaseAddressFormInputs,
): BaseAddress;
export function mapBaseAddressToApi(
  address: BaseAddressFormInputs | undefined,
): BaseAddress | undefined;
export function mapBaseAddressToApi(
  address: BaseAddressFormInputs | undefined,
): BaseAddress | undefined {
  if (isNullish(address)) {
    return undefined;
  }
  switch (address.type) {
    case "DomesticAddress":
      return {
        type: "DomesticAddress",
        street: address.street.trim(),
        houseNumber: mapOptionalValue(address.houseNumber?.trim()),
        addressAddition: mapOptionalValue(address.addressAddition?.trim()),
        country: address.country,
        differentName: mapOptionalValue(address.differentName?.trim()),
        postalCode: address.postalCode.trim(),
        city: address.city.trim(),
      };
    case "PostboxAddress":
      return {
        type: "PostboxAddress",
        postbox: address.postbox.trim(),
        country: address.country,
        differentName: mapOptionalValue(address.differentName?.trim()),
        postalCode: address.postalCode.trim(),
        city: address.city.trim(),
      };
  }
}

export function mapApiAddressToForm(
  address: BaseAddress,
): BaseAddressFormInputs {
  const values: BaseAddressFormInputs = createEmptyAddress();

  switch (address.type) {
    case "DomesticAddress":
      return {
        ...values,
        type: "DomesticAddress",
        street: address.street,
        houseNumber: address.houseNumber ?? "",
        addressAddition: address.addressAddition ?? "",
        country: address.country,
        differentName: address.differentName ?? "",
        postalCode: address.postalCode,
        city: address.city,
      };
    case "PostboxAddress":
      return {
        ...values,
        type: "PostboxAddress",
        postbox: address.postbox,
        country: address.country,
        differentName: address.differentName ?? "",
        postalCode: address.postalCode,
        city: address.city,
      };
  }
}
