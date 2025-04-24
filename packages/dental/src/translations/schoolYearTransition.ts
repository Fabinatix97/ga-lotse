/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiSchoolYearTransitionStatus } from "@eshg/dental-api";

export const SCHOOL_YEAR_TRANSITION_STATUS: Record<
  ApiSchoolYearTransitionStatus,
  string
> = {
  COMPLETE: "erledigt",
  INCOMPLETE: "offen",
};
