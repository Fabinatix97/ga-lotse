/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProphylaxisType } from "@eshg/employee-portal-api/dental";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { PROPHYLAXIS_TYPES } from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";

export const PROPHYLAXIS_TYPE_OPTIONS =
  buildEnumOptions<ApiProphylaxisType>(PROPHYLAXIS_TYPES);
