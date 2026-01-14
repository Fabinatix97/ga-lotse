/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@/lib/businessModules/statistics/shared/routes";

export function getSharedURL(props: {
  detailLinkId: string;
  statisticsSubRoute: "reports" | "evaluations";
}) {
  return new URL(
    routes[props.statisticsSubRoute].details(props.detailLinkId).index,
    window.location.origin,
  ).href;
}
