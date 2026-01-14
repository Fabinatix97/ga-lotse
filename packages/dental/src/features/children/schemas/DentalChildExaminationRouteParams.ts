/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import { UuidSchema } from "@eshg/lib-portal/universal";

import { DentalChildRouteParams } from "./DentalChildRouteParams";

export const DentalChildExaminationRouteParams = v.object({
  ...DentalChildRouteParams.entries,
  examinationId: UuidSchema,
});
export type DentalChildExaminationRouteParams = v.InferOutput<
  typeof DentalChildExaminationRouteParams
>;
