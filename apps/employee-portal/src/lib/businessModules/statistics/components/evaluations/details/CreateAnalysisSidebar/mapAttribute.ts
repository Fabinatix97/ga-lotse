/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export function mapAttributeToAutocompleteSelectionOption(
  isEnabled: (attribute: FlatAttribute) => boolean,
) {
  return (attribute: FlatAttribute) => ({
    label: attribute.name,
    value: attribute.key,
    disabled: !isEnabled(attribute),
  });
}
