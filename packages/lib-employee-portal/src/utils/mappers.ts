/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUser } from "@eshg/base-api";
import { SelectOption } from "@eshg/lib-portal";

export function mapToSelectOption(option: string): SelectOption {
  return {
    label: option,
    value: option,
  };
}

export function buildOptionsFromUsers(users: ApiUser[]) {
  return users.map(buildOptionFromUser);
}

export function buildOptionFromUser(user: ApiUser) {
  return {
    label: `${user.firstName} ${user.lastName}`,
    value: user.userId,
  };
}
