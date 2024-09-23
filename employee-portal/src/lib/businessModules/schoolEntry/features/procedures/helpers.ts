/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddContact200Response } from "@eshg/employee-portal-api/base";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";

export function mapContactToSelectOption(
  contact: ApiAddContact200Response,
): SelectOption {
  return {
    label: contact.name,
    value: contact.id,
  };
}
