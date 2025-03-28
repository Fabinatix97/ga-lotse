/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiAddContact200Response } from "@eshg/base-api";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";

export function mapContactToSelectOption(
  contact: ApiAddContact200Response,
): SelectOption {
  return {
    label: contact.name,
    value: contact.id,
  };
}
