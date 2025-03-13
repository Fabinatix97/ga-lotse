/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@eshg/dental";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { redirect } from "next/navigation";

import { ProphylaxisSessionRouteParams } from "@/app/(businessModules)/dental/prophylaxis-sessions/[prophylaxisSessionId]/layout";

export default function ProphylaxisSessionIndexPage(
  props: DynamicPageProps<ProphylaxisSessionRouteParams>,
) {
  const { prophylaxisSessionId } = props.params;

  redirect(routes.prophylaxisSessions.byId(prophylaxisSessionId).details);
}
