/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal";

import { FLUORIDATION_CONSENTED_VALUES } from "../translations/child";

export const FLUORIDATION_CONSENTED_OPTIONS = buildEnumOptions(
  FLUORIDATION_CONSENTED_VALUES,
);
