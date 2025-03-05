/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import * as v from "valibot";

import { DentalExaminationStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { ParticipantExaminationPage } from "@/lib/businessModules/dental/features/prophylaxisSessions/participantExamination/ParticipantExaminationPage";
import { useFilteredParticipants } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

const PageParamsSchema = v.object({
  participantIndex: v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.integer(),
    v.toMinValue(0),
  ),
});
type PageParamsSchema = v.InferInput<typeof PageParamsSchema>;

type ProphylaxisSessionExaminationPageProps = Readonly<{
  params: PageParamsSchema;
}>;

export default function ProphylaxisSessionExaminationPage(
  props: ProphylaxisSessionExaminationPageProps,
) {
  const { participantIndex } = v.parse(PageParamsSchema, props.params);
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
