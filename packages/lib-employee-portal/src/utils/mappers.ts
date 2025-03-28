/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";

export function mapToSelectOption(option: string): SelectOption {
  return {
    label: option,
    value: option,
  };
}
