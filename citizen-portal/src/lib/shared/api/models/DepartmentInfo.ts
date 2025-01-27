/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiCountryCode,
  ApiGetDepartmentInfoResponse,
  ApiLocation,
} from "@eshg/base-api";

export interface DepartmentInfo {
  readonly name: string;
  readonly abbreviation?: string;
  readonly city: string;
  readonly country: ApiCountryCode;
  readonly email: string;
  readonly homepage: string;
  readonly phoneNumber: string;
  readonly street: string;
  readonly houseNumber: string;
  readonly postalCode: string;
  readonly location: ApiLocation;
}

export function mapDepartmentInfo(
  response: ApiGetDepartmentInfoResponse,
): DepartmentInfo {
  return {
    name: response.name,
    abbreviation: response.abbreviation,
    city: response.city,
    country: response.country,
    phoneNumber: response.phoneNumber,
    email: response.email,
    homepage: response.homepage,
    street: response.street,
    houseNumber: response.houseNumber,
    postalCode: response.postalCode,
    location: response.location,
  };
}
