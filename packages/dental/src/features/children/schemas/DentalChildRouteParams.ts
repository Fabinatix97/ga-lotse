/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import { UuidSchema } from "@eshg/lib-portal/schemas/pageParams";

export const DentalChildRouteParams = v.object({
  childId: UuidSchema,
});
export type DentalChildRouteParams = v.InferOutput<
  typeof DentalChildRouteParams
>;
