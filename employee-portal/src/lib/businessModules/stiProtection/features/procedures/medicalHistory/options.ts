/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGender,
  ApiSexualOrientation,
} from "@eshg/employee-portal-api/stiProtection";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import {
  sexualContactNames,
  sexualOrientationNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

export const sexualOrientationOptions = buildEnumOptions<ApiSexualOrientation>(
  sexualOrientationNames,
);
export const sexualContactOptions =
  buildEnumOptions<ApiGender>(sexualContactNames);
