/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import {
  NextErrorBoundary,
  NextErrorBoundaryProps,
} from "@eshg/lib-portal/components/boundaries/NextErrorBoundary";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";

import { useDentalApi } from "@/contexts/dental";
import { getProphylaxisSessionQuery } from "@/features/prophylaxisSessions/api/queries/details";
import { ProphylaxisSessionStoreProvider } from "@/features/prophylaxisSessions/stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ProphylaxisSessionRouteParams = {
  prophylaxisSessionId: string;
};

export function DentalProphylaxisSessionLayout(
  props: DynamicLayoutProps<ProphylaxisSessionRouteParams>,
) {
  const { prophylaxisSessionId } = use(props.params);
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

export function DentalProphylaxisSessionError(props: NextErrorBoundaryProps) {
  return (
    <MainContentLayout fullViewportHeight>
      <NextErrorBoundary {...props} />
    </MainContentLayout>
  );
}
