/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { getProphylaxisSessionQuery, useDentalApi } from "@eshg/dental";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ProphylaxisSessionStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ProphylaxisSessionRouteParams = {
  prophylaxisSessionId: string;
};

export default function ProphylaxisSessionPageLayout(
  props: DynamicLayoutProps<ProphylaxisSessionRouteParams>,
) {
  const { prophylaxisSessionId } = props.params;
  const { prophylaxisSessionApi } = useDentalApi();
  const { data: prophylaxisSession } = useSuspenseQuery(
    getProphylaxisSessionQuery(prophylaxisSessionApi, {
      prophylaxisSessionId,
    }),
  );

  return (
    <ProphylaxisSessionStoreProvider prophylaxisSession={prophylaxisSession}>
      {props.children}
    </ProphylaxisSessionStoreProvider>
  );
}
