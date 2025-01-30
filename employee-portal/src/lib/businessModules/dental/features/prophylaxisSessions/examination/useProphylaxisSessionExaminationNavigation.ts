/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@eshg/dental/shared/routes";

import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/store/ProphylaxisSessionStoreProvider";

interface UseParticipantNavigationResult {
  gotoPreviousParticipant?: () => void;
  gotoNextParticipant?: () => void;
  gotoOverview: () => void;
}

interface UseParticipantNavigationParams {
  participantIndex: number;
  participantsLength: number;
  onNavigate: (route: string) => void;
}

export function useProphylaxisSessionExaminationNavigation(
  params: UseParticipantNavigationParams,
): UseParticipantNavigationResult {
  const { participantIndex, participantsLength, onNavigate } = params;

  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);

  function examinationRoute(participantIndex: number) {
    return routes.prophylaxisSessions
      .byId(prophylaxisSessionId)
      .examinations.byIndex(participantIndex);
  }

  const gotoPreviousParticipant =
    participantIndex > 0
      ? () => onNavigate(examinationRoute(participantIndex - 1))
      : undefined;

  const nextParticipantIndex = participantIndex + 1;
  const gotoNextParticipant =
    nextParticipantIndex < participantsLength
      ? () => onNavigate(examinationRoute(nextParticipantIndex))
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
