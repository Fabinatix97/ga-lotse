/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { use } from "react";
import { parse } from "valibot";

import { RouteParams } from "@eshg/lib-portal";

import { DentalChildRouteParams } from "../schemas/DentalChildRouteParams";

export function useChildRouteParams(
  asyncParams: Promise<RouteParams>,
): DentalChildRouteParams {
  const params = use(asyncParams);
  return parse(DentalChildRouteParams, params);
}
