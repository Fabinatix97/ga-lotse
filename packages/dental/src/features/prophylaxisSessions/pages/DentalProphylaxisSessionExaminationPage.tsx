/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";
import * as v from "valibot";

import { DynamicPageProps } from "@eshg/lib-portal";
import { UuidSchema } from "@eshg/lib-portal/universal";

import { ExaminationStoreProvider } from "../../../stores/examination/ExaminationStoreProvider";
import { ProphylaxisSessionExaminationLayout } from "../components/prophylaxisSessionExamination/ProphylaxisSessionExaminationLayout";
import { useProphylaxisSessionStore } from "../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

const RouteParamsSchema = v.object({
  examinationId: UuidSchema,
});

export function DentalProphylaxisSessionExaminationPage(
  props: DynamicPageProps,
) {
  const params = use(props.params);
  const { examinationId } = v.parse(RouteParamsSchema, params);
  const participants = useProphylaxisSessionStore(
    (store) => store.participants,
  );
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
