/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiVCardAddress } from "@eshg/employee-portal-api/base";
import { isDeepEqual, isDefined } from "remeda";

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

function isAddressMerge(a?: BaseAddressFormInputs, b?: BaseAddressFormInputs) {
  return isDefined(a) && isDefined(b) && !isDeepEqual(a, b);
}

type AddressMergeSource =
  | {
      type: "Import";
      data: BaseAddressFormInputs | undefined;
    }
  | {
      type: "Entity";
      data: BaseAddress | undefined;
    };

export function getAddressOptions(
  targetAddress: BaseAddress | undefined,
  mergeSource: AddressMergeSource,
) {
  const into: BaseAddressFormInputs | undefined = isDefined(targetAddress)
    ? mapApiAddressToForm(targetAddress)
    : undefined;
  const from: BaseAddressFormInputs | undefined =
    mergeSource.type === "Import"
      ? mergeSource.data
      : isDefined(mergeSource.data)
        ? mapApiAddressToForm(mergeSource.data)
        : undefined;

  const requiresMerge = isAddressMerge(from, into);

  return {
    into,
    from,
    requiresMerge,
    initialAddress: requiresMerge ? undefined : (into ?? from),
  };
}
