/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/travelMedicine";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

export interface User {
  readonly email?: string;
  readonly enabled: boolean;
  readonly externalChatUsername?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber?: string;
  readonly userId: string;
  readonly username: string;
}

export function mapUser(response: ApiUser): User {
  return {
    email: mapOptionalValue(response.email),
    enabled: response.enabled,
    externalChatUsername: mapOptionalValue(response.externalChatUsername),
    firstName: response.firstName,
    lastName: response.lastName,
    phoneNumber: mapOptionalValue(response.phoneNumber),
    userId: response.userId,
    username: response.username,
  };
}
