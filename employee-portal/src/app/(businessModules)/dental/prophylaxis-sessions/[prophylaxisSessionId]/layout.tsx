/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import { useProphylaxisSessionApi } from "@/lib/businessModules/dental/api/clients";
import { getProphylaxisSessionQuery } from "@/lib/businessModules/dental/api/queries/prophylaxisSessionApi";
import { ProphylaxisSessionStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/store/ProphylaxisSessionStoreProvider";

export type ProphylaxisSessionPageProps = Readonly<{
  params: ProphylaxisSessionPageParams;
}>;

interface ProphylaxisSessionPageParams {
  prophylaxisSessionId: string;
}

export default function ProphylaxisSessionPageLayout(
  props: PropsWithChildren<ProphylaxisSessionPageProps>,
) {
  const prophylaxisSessionApi = useProphylaxisSessionApi();
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
