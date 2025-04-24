/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiDomesticAddress, ApiPostboxAddress } from "@eshg/base-api";

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
