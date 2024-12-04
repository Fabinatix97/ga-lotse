/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ProphylaxisSessionPageProps } from "@/app/(businessModules)/dental/prophylaxis-sessions/[prophylaxisSessionId]/layout";
import { useGetProphylaxisSession } from "@/lib/businessModules/dental/api/queries/prophylaxisSessionApi";
import { ProphylaxisSessionDetails } from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionDetails";

export default function ProphylaxisSessionDetailsPage(
  props: ProphylaxisSessionPageProps,
) {
  const prophylaxisSession = useGetProphylaxisSession({
    prophylaxisSessionId: props.params.prophylaxisSessionId,
  });

  return (
    <ProphylaxisSessionDetails prophylaxisSession={prophylaxisSession.data} />
  );
}
