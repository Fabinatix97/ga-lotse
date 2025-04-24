/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { UuidSchema } from "@eshg/lib-portal/schemas/pageParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";
import * as v from "valibot";

import { ProphylaxisSessionExaminationLayout } from "@/features/prophylaxisSessions/components/prophylaxisSessionExamination/ProphylaxisSessionExaminationLayout";
import { useFilteredParticipants } from "@/features/prophylaxisSessions/stores/prophylaxisSession/ProphylaxisSessionStoreProvider";
import { ExaminationStoreProvider } from "@/stores/examination/ExaminationStoreProvider";

const RouteParamsSchema = v.object({
  examinationId: UuidSchema,
});

export function DentalProphylaxisSessionExaminationPage(
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
    <ExaminationStoreProvider
      examinationResult={participant.result}
      defaultDentitionType={participant.prophylaxisDentitionType}
      previousExaminationResult={
        previousExaminations.length > 0 ? previousExaminations[0] : undefined
      }
    >
      <ProphylaxisSessionExaminationLayout
        participant={participant}
        participantsLength={participants.length}
      />
    </ExaminationStoreProvider>
  );
}
