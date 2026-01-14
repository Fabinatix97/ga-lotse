/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from "react";
import { StoreApi, useStore } from "zustand";

import { ProphylaxisSessionDetails } from "../../api/models/ProphylaxisSessionDetails";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";

import { type ProphylaxisSessionStore } from "./prophylaxisSessionStore";

export function useSyncIncomingProphylaxisSessionChanges(
  store: StoreApi<ProphylaxisSessionStore>,
  prophylaxisSession: ProphylaxisSessionDetails,
) {
  const localVersion = useStore(store, (state) => state.version);
  const participants = useStore(store, (state) => state.participants);
  const setProphylaxisSession = useStore(
    store,
    (state) => state.setProphylaxisSession,
  );

  const versionChanged = prophylaxisSession.version !== localVersion;
  const participantsChanged = hasChangedParticipants(
    participants,
    prophylaxisSession.participants,
  );
  const syncIncomingChanges = versionChanged || participantsChanged;
  useEffect(() => {
    if (syncIncomingChanges) {
      setProphylaxisSession(prophylaxisSession);
    }
  }, [prophylaxisSession, syncIncomingChanges, setProphylaxisSession]);
}

function hasChangedParticipants(
  localParticipants: ProphylaxisSessionExamination[],
  remoteParticipants: ProphylaxisSessionExamination[],
): boolean {
  if (localParticipants.length !== remoteParticipants.length) {
    return true;
  }

  return (
    getParticipantsHash(localParticipants) !==
    getParticipantsHash(remoteParticipants)
  );
}

// creates a unique hash for all participants to identify changes by string comparison
function getParticipantsHash(
  participants: ProphylaxisSessionExamination[],
): string {
  return JSON.stringify(
    participants.toSorted(compareByExaminationId).map(getExaminationHash),
  );
}

function compareByExaminationId(
  a: ProphylaxisSessionExamination,
  b: ProphylaxisSessionExamination,
) {
  return a.examinationId.localeCompare(b.examinationId);
}

function getExaminationHash(
  participant: ProphylaxisSessionExamination,
): (string | number)[] {
  return [
    participant.examinationId,
    participant.examinationVersion,
    participant.id,
    participant.version,
  ];
}
