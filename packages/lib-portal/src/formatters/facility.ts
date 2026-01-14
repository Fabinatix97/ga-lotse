/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined, isNullish } from "remeda";

import { Nullable } from "../types/utility";

interface Facility {
  name: string;
}

export function formatFacilityName(facility: Nullable<Partial<Facility>>) {
  if (isNullish(facility) || !isDefined(facility.name)) {
    return "";
  }

  return facility.name;
}
