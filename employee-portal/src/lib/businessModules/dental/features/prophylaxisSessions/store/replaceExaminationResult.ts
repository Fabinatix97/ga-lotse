/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildExamination } from "@eshg/dental/api/models/ChildExamination";
import { ExaminationResult } from "@eshg/dental/api/models/ExaminationResult";

export function replaceExaminationResult(
  participantId: string,
  examinationResult: ExaminationResult,
  participants: ChildExamination[],
): ChildExamination[] {
  return participants.map((participant) => {
    if (participant.childId !== participantId) {
      return participant;
    }

    return {
      ...participant,
      result: examinationResult,
    };
  });
}
