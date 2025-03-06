/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { getProphylaxisSessionQuery, useDentalApi } from "@eshg/dental";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import { ProphylaxisSessionStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

export type ProphylaxisSessionPageProps = Readonly<{
  params: ProphylaxisSessionPageParams;
}>;

interface ProphylaxisSessionPageParams {
  prophylaxisSessionId: string;
}

export default function ProphylaxisSessionPageLayout(
  props: PropsWithChildren<ProphylaxisSessionPageProps>,
) {
  const { prophylaxisSessionApi } = useDentalApi();
  const { data: prophylaxisSession } = useSuspenseQuery(
    getProphylaxisSessionQuery(prophylaxisSessionApi, {
      prophylaxisSessionId: props.params.prophylaxisSessionId,
    }),
  );

  return (
    <ProphylaxisSessionStoreProvider prophylaxisSession={prophylaxisSession}>
      {props.children}
    </ProphylaxisSessionStoreProvider>
  );
}
