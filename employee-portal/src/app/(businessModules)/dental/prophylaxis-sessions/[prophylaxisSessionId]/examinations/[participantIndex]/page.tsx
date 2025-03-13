/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PositiveIntegerSchema } from "@eshg/lib-portal/schemas/pageParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import * as v from "valibot";

import { DentalExaminationStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { ParticipantExaminationPage } from "@/lib/businessModules/dental/features/prophylaxisSessions/participantExamination/ParticipantExaminationPage";
import { useFilteredParticipants } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

const RouteParamsSchema = v.object({
  participantIndex: PositiveIntegerSchema,
});

export default function ProphylaxisSessionExaminationPage(
  props: DynamicPageProps,
) {
  const { participantIndex } = v.parse(RouteParamsSchema, props.params);
  const filteredParticipants = useFilteredParticipants();
  const participant = filteredParticipants.at(participantIndex);
  if (participant === undefined) {
    throw new Error(
      `Participant with index ${participantIndex} does not exist`,
    );
  }

  return (
    <DentalExaminationStoreProvider
      examinationResult={participant.result}
      defaultDentitionType={participant.prophylaxisDentitionType}
      previousExaminationResult={
        participant.previousExaminationResults.length > 0
          ? participant.previousExaminationResults[0]
          : undefined
      }
    >
      <ParticipantExaminationPage
        participant={participant}
        participantIndex={participantIndex}
        participantsLength={filteredParticipants.length}
      />
    </DentalExaminationStoreProvider>
  );
}
