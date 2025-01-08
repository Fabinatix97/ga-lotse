/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { ProphylaxisSessionPageProps } from "@/app/(businessModules)/dental/prophylaxis-sessions/[prophylaxisSessionId]/layout";
import { routes } from "@/lib/businessModules/dental/shared/routes";

export default function ProphylaxisSessionIndexPage(
  props: ProphylaxisSessionPageProps,
) {
  redirect(
    routes.prophylaxisSessions.byId(props.params.prophylaxisSessionId).details,
  );
}
