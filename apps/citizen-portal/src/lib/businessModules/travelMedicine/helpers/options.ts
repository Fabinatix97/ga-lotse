/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiTravelTimeUnit } from "@eshg/travel-medicine-api";

import { TRAVEL_TIME_UNITS } from "@/lib/businessModules/travelMedicine/helpers/translations";

export const VACCINATION_CONSULTATION_TRAVEL_TIME_UNITS =
  buildEnumOptions<ApiTravelTimeUnit>(TRAVEL_TIME_UNITS).filter(
    (option) => option.value,
  );
