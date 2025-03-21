/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGender, ApiSalutation } from "@eshg/base-api";
import { BaseAddressFormInputs } from "@eshg/lib-employee-portal";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

export interface BaseFacilityContactPerson {
  emailAddress: string;
  phoneNumber: string;
  role: string;
  lastName: string;
  firstName: string;
  title: string;
  salutation: OptionalFieldValue<ApiSalutation>;
  gender: OptionalFieldValue<ApiGender>;
  mainContact: boolean;
}

export interface BaseFacility {
  name: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  contactAddress: BaseAddressFormInputs;
  billingAddress?: BaseAddressFormInputs;
  contactPersons: BaseFacilityContactPerson[];
}
