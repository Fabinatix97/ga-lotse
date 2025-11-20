/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { use } from "react";
import { parse } from "valibot";

import { RouteParams } from "@eshg/lib-portal";

import { ProstituteProtectionProcedureRouteParams } from "../../schemas/ProstituteProtectionProcedureRouteParams";

export function useProcedureRouteParams(
  asyncParams: Promise<RouteParams>,
): ProstituteProtectionProcedureRouteParams {
  const params = use(asyncParams);
  return parse(ProstituteProtectionProcedureRouteParams, params);
}
