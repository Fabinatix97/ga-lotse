/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { UuidSchema } from "@eshg/lib-portal/schemas/pageParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";
import * as v from "valibot";

import { DentalExaminationStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { ParticipantExaminationPage } from "@/lib/businessModules/dental/features/prophylaxisSessions/participantExamination/ParticipantExaminationPage";
import { useFilteredParticipants } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

const RouteParamsSchema = v.object({
  examinationId: UuidSchema,
});

export default function ProphylaxisSessionExaminationPage(
  props: DynamicPageProps,
) {
  const params = use(props.params);
  const { examinationId } = v.parse(RouteParamsSchema, params);
  const participants = useFilteredParticipants();
  const participant = participants.find(
    (p) => p.examinationId === examinationId,
  );
  if (participant === undefined) {
    throw new Error(
      `Participant with examinationId ${examinationId} does not exist`,
    );
  }
  const previousExaminations = participant.previousExaminations;

  return (
    <DentalExaminationStoreProvider
      examinationResult={participant.result}
      defaultDentitionType={participant.prophylaxisDentitionType}
      previousExaminationResult={
        previousExaminations.length > 0 ? previousExaminations[0] : undefined
      }
    >
      <ParticipantExaminationPage
        participant={participant}
        participantsLength={participants.length}
      />
    </DentalExaminationStoreProvider>
  );
}
