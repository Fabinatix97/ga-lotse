/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiAddContact200Response } from "@eshg/base-api";
import { SelectOption } from "@eshg/lib-portal";

export function mapContactToSelectOption(
  contact: ApiAddContact200Response,
): SelectOption {
  return {
    label: contact.name,
    value: contact.id,
  };
}
