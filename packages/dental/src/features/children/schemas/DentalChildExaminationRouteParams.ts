/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UuidSchema } from "@eshg/lib-portal/schemas/pageParams";
import * as v from "valibot";

import { DentalChildRouteParams } from "./DentalChildRouteParams";

export const DentalChildExaminationRouteParams = v.object({
  ...DentalChildRouteParams.entries,
  examinationId: UuidSchema,
});
export type DentalChildExaminationRouteParams = v.InferOutput<
  typeof DentalChildExaminationRouteParams
>;
