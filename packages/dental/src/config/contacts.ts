/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactCategory } from "@eshg/base-api";

export const SCHOOL_OR_DAYCARE_CONTACT = new Set<ApiContactCategory>([
  ApiContactCategory.School,
  ApiContactCategory.Daycare,
]);
