/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOralHygieneStatus } from "@eshg/dental-api";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { ORAL_HYGIENE_STATUS_STATUS } from "@/lib/businessModules/dental/features/children/translations";

export const ORAL_HYGIENE_STATUS_OPTIONS =
  buildEnumOptions<ApiOralHygieneStatus>(ORAL_HYGIENE_STATUS_STATUS, true);
