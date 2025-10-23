/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseAddress,
  TaggedDomesticAddress,
  TaggedPostboxAddress,
} from "@eshg/lib-employee-portal";

import {
  SchoolEntryAddress,
  TaggedSchoolEntryDomesticAddress,
  TaggedSchoolEntryPostboxAddress,
} from "@/lib/businessModules/schoolEntry/api/schoolEntryAddress";

export function mapContactAndDifferentBillingAddressToSchoolEntry<
  S extends {
    contactAddress?: BaseAddress;
    differentBillingAddress?: BaseAddress;
    remainingFields?: Record<string, unknown>;
  },
  T extends {
    contactAddress?: SchoolEntryAddress;
    differentBillingAddress?: SchoolEntryAddress;
    remainingFields?: Record<string, unknown>;
  },
>(input: S): T {
  return {
    ...input,
    contactAddress: mapToSchoolEntryAddress(input.contactAddress),
    differentBillingAddress: mapToSchoolEntryAddress(
      input.differentBillingAddress,
    ),
  } as unknown as T;
}

export function mapToSchoolEntryAddress(
  address: BaseAddress | undefined,
): SchoolEntryAddress | undefined {
  switch (address?.type) {
    case undefined: {
      return undefined;
    }
    case "DomesticAddress": {
      return mapToSchoolEntryDomesticAddress(address);
    }
    case "PostboxAddress": {
      return mapToSchoolEntryPostboxAddress(address);
    }
  }
}

function mapToSchoolEntryDomesticAddress(
  address: TaggedDomesticAddress,
): TaggedSchoolEntryDomesticAddress {
  return { ...address, type: "SchoolEntryDomesticAddress" };
}

function mapToSchoolEntryPostboxAddress(
  address: TaggedPostboxAddress,
): TaggedSchoolEntryPostboxAddress {
  return { ...address, type: "SchoolEntryPostboxAddress" };
}
