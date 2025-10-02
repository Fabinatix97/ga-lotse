/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { isDefined } from "remeda";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { ProphylaxisSessionStatusChip } from "../../../components/prophylaxisSession/ProphylaxisSessionStatusChip";
import { routes } from "../../../config/routes";
import { ProphylaxisSessionDetails } from "../components/prophylaxisSessionDetails/ProphylaxisSessionDetails";
import { useProphylaxisSessionStore } from "../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";
import { useSyncOutgoingProphylaxisSessionChanges } from "../stores/prophylaxisSession/useSyncOutgoingProphylaxisSessionChanges";

export function DentalProphylaxisSessionDetailsPage() {
  const institutionName = useProphylaxisSessionStore(
    (state) => state.institution.name,
  );
  const groupName = useProphylaxisSessionStore((state) => state.groupName);
  const prophylaxisSessionStatus = useProphylaxisSessionStore(
    (state) => state.status,
  );

  useSyncOutgoingProphylaxisSessionChanges();

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={
            isDefined(groupName)
              ? `Maßnahme - ${institutionName} - ${groupName}`
              : `Maßnahme - ${institutionName}`
          }
          backButton={
            <ToolbarBackButton href={routes.prophylaxisSessions.overview} />
          }
          afterTitle={
            <ProphylaxisSessionStatusChip
              status={prophylaxisSessionStatus}
              data-testid="status-chip"
              invisibleStatusLabel
            />
          }
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <ProphylaxisSessionDetails />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
