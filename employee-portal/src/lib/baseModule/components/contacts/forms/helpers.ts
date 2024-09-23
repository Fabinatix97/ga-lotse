/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiVCardAddress } from "@eshg/employee-portal-api/base";
import { isDefined } from "remeda";

import {
  InstitutionContactMergeSource,
  PersonContactMergeSource,
} from "@/lib/baseModule/components/contacts/types";
import {
  BaseAddressFormInputs,
  createEmptyAddress,
  mapApiAddressToForm,
} from "@/lib/shared/components/form/address/helpers";
import { BaseAddress } from "@/lib/shared/helpers/address";

export const UnselectedValue = Symbol("Unselected merge value");
export type RequiredMergeValue<T> = T | typeof UnselectedValue;
export type OptionalMergeValue<T> = T | "" | typeof UnselectedValue;

export function mapRequiredMergeValue<T>(value: RequiredMergeValue<T>): T {
  if (value === UnselectedValue) {
    throw new Error("Value is expected to be non-empty.");
  }

  return value;
}

export function mapOptionalMergeValue<T>(
  value: OptionalMergeValue<T>,
): T | undefined {
  if (value === UnselectedValue || value === "") {
    return undefined;
  }

  return value;
}

export function mapMergeValue<T>(
  into: T | undefined,
  from: T | undefined,
): T | "" | typeof UnselectedValue {
  return into === from ? (into ?? "") : UnselectedValue;
}

export function isValidAddress(
  address: BaseAddress | BaseAddressFormInputs | undefined,
): boolean {
  return (
    isDefined(address) &&
    address.city !== "" &&
    address.postalCode !== "" &&
    ((address.type === "DomesticAddress" && address.street.trim() !== "") ||
      (address.type === "PostboxAddress" && address.postbox.trim() !== ""))
  );
}

export function distinctConcat<T>(listA: T[], listB: T[]): T[] {
  return [...new Set(listA.concat(listB))];
}

export function getAddressOptions(
  targetAddress: BaseAddress | undefined,
  mergeSource: PersonContactMergeSource | InstitutionContactMergeSource,
) {
  return [
    isDefined(targetAddress) ? mapApiAddressToForm(targetAddress) : undefined,
    isValidAddress(mergeSource.data.contactAddress)
      ? mergeSource.type === "Import"
        ? mergeSource.data.contactAddress
        : mapApiAddressToForm(mergeSource.data.contactAddress!)
      : undefined,
  ].filter(isDefined);
}

export function mapVCardAddressToForm(address: ApiVCardAddress | undefined) {
  return isDefined(address)
    ? ({
        ...createEmptyAddress(),
        street: address.street,
        houseNumber: address.houseNumber,
        city: address.city,
        postalCode: address.postalCode,
        addressAddition: address.addressAddition,
        postbox: address.postBox,
        type: address.postBox !== "" ? "PostboxAddress" : "DomesticAddress",
      } as const)
    : createEmptyAddress();
}
