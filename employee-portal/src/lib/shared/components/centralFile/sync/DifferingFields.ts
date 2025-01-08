/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiDomesticAddress,
  ApiPersonDetails,
  ApiPostboxAddress,
} from "@eshg/employee-portal-api/base";

export const basePersonDiffFieldNames = [
  "salutation",
  "title",
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "nameAtBirth",
  "placeOfBirth",
  "countryOfBirth",
] as const satisfies (keyof ApiPersonDetails)[];

export const baseAddressDiffFieldNames = [
  "street",
  "houseNumber",
  "addressAddition",
  "postbox",
  "postalCode",
  "city",
  "country",
  "differentName",
] as const satisfies (keyof AddressUnion)[];

export type AddressUnion = ApiDomesticAddress & ApiPostboxAddress;

export class TypedDifferingFields<T extends object> {
  constructor(private readonly differingFields: string[]) {}

  includes(fieldName: keyof T & string) {
    return this.differingFields.includes(fieldName);
  }

  includesAny(...fieldNames: (keyof T & string)[]) {
    return fieldNames.some((name) => this.includes(name));
  }
}
