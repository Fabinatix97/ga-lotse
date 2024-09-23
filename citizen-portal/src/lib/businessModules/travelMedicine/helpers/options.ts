/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTravelTimeUnit } from "@eshg/citizen-portal-api/travelMedicine";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { TRAVEL_TIME_UNITS } from "@/lib/businessModules/travelMedicine/helpers/translations";

export const VACCINATION_CONSULTATION_TRAVEL_TIME_UNITS =
  buildEnumOptions<ApiTravelTimeUnit>(TRAVEL_TIME_UNITS).filter(
    (option) => option.value,
  );
