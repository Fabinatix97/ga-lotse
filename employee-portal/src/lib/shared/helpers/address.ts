/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiAddress,
  ApiDomesticAddress,
  ApiPostboxAddress,
  instanceOfApiDomesticAddress,
  instanceOfApiPostboxAddress,
} from "@eshg/employee-portal-api/base";
import { isNonNullish } from "remeda";

export type BaseAddressType = "DomesticAddress" | "PostboxAddress";

export type TaggedDomesticAddress = ApiDomesticAddress & {
  type: "DomesticAddress";
};
export type TaggedPostboxAddress = ApiPostboxAddress & {
  type: "PostboxAddress";
};

export type BaseAddress = TaggedDomesticAddress | TaggedPostboxAddress;

export function isPostboxAddress(
  address: BaseAddress | undefined,
): address is TaggedPostboxAddress {
  return address?.type === "PostboxAddress";
}

export function isDomesticAddress(
  address: BaseAddress | undefined,
): address is TaggedDomesticAddress {
  return address?.type === "DomesticAddress";
}

export function isBaseAddress(
  apiAddress?: ApiAddress,
): apiAddress is BaseAddress {
  return (
    isNonNullish(apiAddress) &&
    (instanceOfApiPostboxAddress(apiAddress) ||
      instanceOfApiDomesticAddress(apiAddress))
  );
}
