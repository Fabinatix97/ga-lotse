/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PROPHYLAXIS_TYPES } from "@eshg/dental";
import { ApiDentitionType, ApiProphylaxisType } from "@eshg/dental-api";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import {
  DENTITION_TYPES,
  FLUORIDATION_VARNISH_TYPES,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";

export const PROPHYLAXIS_TYPE_OPTIONS =
  buildEnumOptions<ApiProphylaxisType>(PROPHYLAXIS_TYPES);

export const FLUORIDATION_VARNISH_OPTIONS = buildEnumOptions<string>(
  FLUORIDATION_VARNISH_TYPES,
);

export const DENTITION_TYPE_OPTIONS =
  buildEnumOptions<ApiDentitionType>(DENTITION_TYPES);
