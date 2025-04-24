/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@/config/routes";
import { ProphylaxisSessionExamination } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionExamination";
import { useProphylaxisSessionStore } from "@/features/prophylaxisSessions/stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

interface UseParticipantNavigationResult {
  gotoPreviousParticipant?: (submit?: boolean) => Promise<void>;
  gotoNextParticipant?: (submit?: boolean) => Promise<void>;
  gotoOverview: (submit?: boolean) => Promise<void>;
}

interface UseParticipantNavigationParams {
  participants: ProphylaxisSessionExamination[];
  onNavigate: (route: string) => void;
  examinationId: string;
  onSubmit: () => Promise<void>;
}

export function useParticipantNavigation(
  params: UseParticipantNavigationParams,
): UseParticipantNavigationResult {
  const { examinationId, participants, onNavigate } = params;
  const participantsLength = participants.length;
  const participantIndex = participants.findIndex(
    (e) => e.examinationId === examinationId,
  );

  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);

  function examinationRoute(examinationId: string) {
    return routes.prophylaxisSessions
      .byId(prophylaxisSessionId)
      .examinations.byExaminationId(examinationId);
  }

  function tryWithOptionalSubmit(onContinue: () => void) {
    return async function navigationHandler(submit = true): Promise<void> {
      try {
        if (submit) {
          await params.onSubmit();
        }
        onContinue();
      } catch {}
    };
  }

  const gotoPreviousParticipant =
    participantIndex > 0
      ? tryWithOptionalSubmit(() => {
          const previousParticipant = participants[participantIndex - 1];
          if (previousParticipant !== undefined) {
            onNavigate(examinationRoute(previousParticipant.examinationId));
          }
        })
      : undefined;

  const nextParticipantIndex = participantIndex + 1;
  const gotoNextParticipant =
    nextParticipantIndex < participantsLength
      ? tryWithOptionalSubmit(() => {
          const nextParticipant = participants[nextParticipantIndex];
          if (nextParticipant !== undefined) {
            onNavigate(examinationRoute(nextParticipant.examinationId));
          }
        })
      : undefined;

  const gotoOverview = tryWithOptionalSubmit(() =>
    onNavigate(routes.prophylaxisSessions.byId(prophylaxisSessionId).details),
  );

  return {
    gotoPreviousParticipant,
    gotoNextParticipant,
    gotoOverview,
  };
}
