/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import { UuidSchema } from "@eshg/lib-portal/universal";

export const DentalGroupsRouteParams = v.object({
  institutionId: UuidSchema,
});

export type DentalGroupsRouteParams = v.InferOutput<
  typeof DentalGroupsRouteParams
>;
