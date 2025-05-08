/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { use } from "react";
import { parse } from "valibot";

import { RouteParams } from "@eshg/lib-portal/types/pageParams";

import { DentalGroupsRouteParams } from "../schemas/DentalGroupsRouteParams";

export function useGroupsRouteParams(
  asyncParams: Promise<RouteParams>,
): DentalGroupsRouteParams {
  const params = use(asyncParams);
  return parse(DentalGroupsRouteParams, params);
}
