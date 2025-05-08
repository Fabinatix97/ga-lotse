/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import { UuidSchema } from "@eshg/lib-portal/schemas/pageParams";

export const DentalDaycareChildrenRouteParams = v.object({
  institutionId: UuidSchema,
});

export type DentalDaycareChildrenRouteParams = v.InferOutput<
  typeof DentalDaycareChildrenRouteParams
>;
