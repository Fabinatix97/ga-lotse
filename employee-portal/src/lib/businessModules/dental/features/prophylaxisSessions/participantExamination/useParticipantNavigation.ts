/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ProphylaxisSessionExamination, routes } from "@eshg/dental";

import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

interface UseParticipantNavigationResult {
  gotoPreviousParticipant?: (submit?: boolean) => void;
  gotoNextParticipant?: (submit?: boolean) => void;
  gotoOverview: (submit?: boolean) => void;
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

  const gotoPreviousParticipant =
    participantIndex > 0
      ? (submit = true) => {
          const previousParticipant = participants[participantIndex - 1];
          if (previousParticipant !== undefined) {
            onNavigate(examinationRoute(previousParticipant.examinationId));
          }
          if (submit) {
            void params.onSubmit();
          }
        }
      : undefined;

  const nextParticipantIndex = participantIndex + 1;
  const gotoNextParticipant =
    nextParticipantIndex < participantsLength
      ? (submit = true) => {
          const nextParticipant = participants[nextParticipantIndex];
          if (nextParticipant !== undefined) {
            onNavigate(examinationRoute(nextParticipant.examinationId));
          }
          if (submit) {
            void params.onSubmit();
          }
        }
      : undefined;

  function gotoOverview(submit = true) {
    onNavigate(routes.prophylaxisSessions.byId(prophylaxisSessionId).details);
    if (submit) {
      void params.onSubmit();
    }
  }

  return {
    gotoPreviousParticipant,
    gotoNextParticipant,
    gotoOverview,
  };
}
