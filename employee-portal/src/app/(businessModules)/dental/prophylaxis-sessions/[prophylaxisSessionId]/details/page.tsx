/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { routes } from "@eshg/dental/shared/routes";
import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { ProphylaxisSessionDetails } from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionDetails";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";
import { useSyncOutgoingProphylaxisSessionChanges } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/useSyncOutgoingProphylaxisSessionChanges";

export default function ProphylaxisSessionDetailsPage() {
  const institutionName = useProphylaxisSessionStore(
    (state) => state.institution.name,
  );
  const groupName = useProphylaxisSessionStore((state) => state.groupName);

  useSyncOutgoingProphylaxisSessionChanges();

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Prophylaxe - ${institutionName} - ${groupName}`}
          backHref={routes.prophylaxisSessions.overview}
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <ProphylaxisSessionDetails />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
