/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiChildDetails,
  ApiCountryCode,
  ApiSalutation,
} from "@eshg/dental-api";
import { BaseAddress } from "@eshg/lib-employee-portal";

export interface PersonDetails {
  readonly fileStateId: string;
  readonly version: number;
  readonly outdated: boolean;
  readonly title?: string;
  readonly salutation: ApiSalutation;
  readonly nameAtBirth?: string;
  readonly placeOfBirth?: string;
  readonly countryOfBirth?: ApiCountryCode;
  readonly emailAddresses?: string[];
  readonly phoneNumbers?: string[];
  readonly contactAddress?: BaseAddress;
  readonly differentBillingAddress?: BaseAddress;
}

export function mapPersonDetails(response: ApiChildDetails): PersonDetails {
  return {
    fileStateId: response.fileStateId,
    version: response.personVersion,
    outdated: response.fileStateOutdated,
    title: response.title,
    salutation: response.salutation,
    nameAtBirth: response.nameAtBirth,
    placeOfBirth: response.placeOfBirth,
    countryOfBirth: response.countryOfBirth,
    emailAddresses: response.emailAddresses,
    phoneNumbers: response.phoneNumbers,
    contactAddress: response.contactAddress,
    differentBillingAddress: response.differentBillingAddress,
  };
}
