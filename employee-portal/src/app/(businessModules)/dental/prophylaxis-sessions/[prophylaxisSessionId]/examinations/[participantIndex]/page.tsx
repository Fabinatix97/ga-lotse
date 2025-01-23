/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import * as v from "valibot";

import { ProphylaxisSessionExaminationBottomBar } from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionExaminationBottomBar";
import { ProphylaxisSessionExaminationToolbar } from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionExaminationToolbar";
import {
  useFilteredParticipants,
  useProphylaxisSessionStore,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/store/ProphylaxisSessionStoreProvider";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";

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
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const filteredParticipants = useFilteredParticipants();

  const participant = filteredParticipants.at(participantIndex);
  if (participant === undefined) {
    throw new Error(
      `Participant with index ${participantIndex} does not exist`,
    );
  }
  const previousParticipantIndex =
    participantIndex > 0 ? participantIndex - 1 : undefined;
  const nextParticipantIndex =
    participantIndex < filteredParticipants.length - 1
      ? participantIndex + 1
      : undefined;

  return (
    <StickyToolbarLayout
      toolbar={
        <ProphylaxisSessionExaminationToolbar
          prophylaxisSessionId={prophylaxisSessionId}
          participant={participant}
          participantIndex={participantIndex}
        />
      }
    >
      <MainContentLayout fullViewportHeight></MainContentLayout>
      <ProphylaxisSessionExaminationBottomBar
        prophylaxisSessionId={prophylaxisSessionId}
        previousParticipantIndex={previousParticipantIndex}
        nextParticipantIndex={nextParticipantIndex}
      />
    </StickyToolbarLayout>
  );
}
