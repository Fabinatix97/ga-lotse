/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import { UuidSchema } from "@eshg/lib-portal/universal";

export const DentalChildRouteParams = v.object({
  childId: UuidSchema,
});
export type DentalChildRouteParams = v.InferOutput<
  typeof DentalChildRouteParams
>;
