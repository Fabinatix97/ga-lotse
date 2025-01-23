/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { routes } from "@eshg/dental/shared/routes";

import { ProphylaxisSessionDetails } from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionDetails";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/store/ProphylaxisSessionStoreProvider";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ProphylaxisSessionDetailsPage() {
  const institutionName = useProphylaxisSessionStore(
    (state) => state.institution.name,
  );
  const groupName = useProphylaxisSessionStore((state) => state.groupName);

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
