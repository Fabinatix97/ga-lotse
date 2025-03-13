/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UuidSchema } from "@eshg/lib-portal/schemas/pageParams";
import * as v from "valibot";

export const OfficialMedicalServiceDetailsRouteParamsSchema = v.object({
  id: UuidSchema,
});
export type OfficialMedicalServiceDetailsRouteParamsSchema = v.InferOutput<
  typeof OfficialMedicalServiceDetailsRouteParamsSchema
>;
