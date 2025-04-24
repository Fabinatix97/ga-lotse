/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from "react";
import { StoreApi, useStore } from "zustand";

import { ProphylaxisSessionDetails } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionDetails";

import { type ProphylaxisSessionStore } from "./prophylaxisSessionStore";

export function useSyncIncomingProphylaxisSessionChanges(
  store: StoreApi<ProphylaxisSessionStore>,
  prophylaxisSession: ProphylaxisSessionDetails,
) {
  const changedExaminationsById = useStore(
    store,
    (state) => state.changedExaminationsById,
  );
  const setProphylaxisSession = useStore(
    store,
    (state) => state.setProphylaxisSession,
  );

  const canUpdate = changedExaminationsById.size === 0;
  useEffect(() => {
    if (canUpdate) {
      setProphylaxisSession(prophylaxisSession);
    }
  }, [prophylaxisSession, canUpdate, setProphylaxisSession]);
}
