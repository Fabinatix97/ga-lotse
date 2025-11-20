/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import { UuidSchema } from "@eshg/lib-portal/universal";

export const ProstituteProtectionProcedureRouteParams = v.object({
  id: UuidSchema,
});
export type ProstituteProtectionProcedureRouteParams = v.InferOutput<
  typeof ProstituteProtectionProcedureRouteParams
>;
