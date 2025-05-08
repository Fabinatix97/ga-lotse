/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDentitionType,
  ApiFluoridationVarnish,
  ApiProphylaxisStatus,
  ApiProphylaxisType,
} from "@eshg/dental-api";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import {
  DENTITION_TYPES,
  FLUORIDATION_VARNISH_TYPES,
  PROPHYLAXIS_STATUS,
  PROPHYLAXIS_TYPES,
} from "../translations/prophylaxisSession";

export const DENTITION_TYPE_OPTIONS =
  buildEnumOptions<ApiDentitionType>(DENTITION_TYPES);

export const PROPHYLAXIS_TYPE_OPTIONS =
  buildEnumOptions<ApiProphylaxisType>(PROPHYLAXIS_TYPES);

export const FLUORIDATION_VARNISH_OPTIONS =
  buildEnumOptions<ApiFluoridationVarnish>(FLUORIDATION_VARNISH_TYPES);

export const PROPHYLAXIS_STATUS_OPTIONS =
  buildEnumOptions<ApiProphylaxisStatus>(PROPHYLAXIS_STATUS);
