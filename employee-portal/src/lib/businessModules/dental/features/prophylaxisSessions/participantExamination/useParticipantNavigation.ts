/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildExamination, routes } from "@eshg/dental";

import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

interface UseParticipantNavigationResult {
  gotoPreviousParticipant?: () => void;
  gotoNextParticipant?: () => void;
  gotoOverview: () => void;
}

interface UseParticipantNavigationParams {
  participants: ChildExamination[];
  onNavigate: (route: string) => void;
  examinationId: string;
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

  const gotoPreviousParticipant =
    participantIndex > 0
      ? () => {
          const previousParticipant = participants[participantIndex - 1];
          if (previousParticipant !== undefined) {
            onNavigate(examinationRoute(previousParticipant.examinationId));
          }
        }
      : undefined;

  const nextParticipantIndex = participantIndex + 1;
  const gotoNextParticipant =
    nextParticipantIndex < participantsLength
      ? () => {
          const nextParticipant = participants[nextParticipantIndex];
          if (nextParticipant !== undefined) {
            onNavigate(examinationRoute(nextParticipant.examinationId));
          }
        }
      : undefined;

  function gotoOverview() {
    onNavigate(routes.prophylaxisSessions.byId(prophylaxisSessionId).details);
  }

  return {
    gotoPreviousParticipant,
    gotoNextParticipant,
    gotoOverview,
  };
}
