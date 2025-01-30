/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isDefined } from "remeda";
import * as v from "valibot";

import { AdditionalInformationFormSection } from "@/lib/businessModules/dental/features/examinations/AdditionalInformationFormSection";
import { ExaminationFormLayout } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { NoteFormSection } from "@/lib/businessModules/dental/features/examinations/NoteFormSection";
import { ProphylaxisSessionExaminationBottomBar } from "@/lib/businessModules/dental/features/prophylaxisSessions/examination/ProphylaxisSessionExaminationBottomBar";
import { ProphylaxisSessionExaminationForm } from "@/lib/businessModules/dental/features/prophylaxisSessions/examination/ProphylaxisSessionExaminationForm";
import { ProphylaxisSessionExaminationToolbar } from "@/lib/businessModules/dental/features/prophylaxisSessions/examination/ProphylaxisSessionExaminationToolbar";
import { ADDITIONAL_INFO_FORM_COMPONENTS } from "@/lib/businessModules/dental/features/prophylaxisSessions/examination/formComponents";
import { useProphylaxisSessionExaminationForm } from "@/lib/businessModules/dental/features/prophylaxisSessions/examination/useProphylaxisSessionExaminationForm";
import { useProphylaxisSessionExaminationNavigation } from "@/lib/businessModules/dental/features/prophylaxisSessions/examination/useProphylaxisSessionExaminationNavigation";
import {
  useFilteredParticipants,
  useProphylaxisSessionStore,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/store/ProphylaxisSessionStoreProvider";
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
  const filteredParticipants = useFilteredParticipants();
  const participant = filteredParticipants.at(participantIndex);
  if (participant === undefined) {
    throw new Error(
      `Participant with index ${participantIndex} does not exist`,
    );
  }

  const router = useRouter();
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const isScreening = useProphylaxisSessionStore((state) => state.isScreening);
  const fluoridationVarnish = useProphylaxisSessionStore(
    (state) => state.fluoridationVarnish,
  );
  const setExaminationResult = useProphylaxisSessionStore(
    (state) => state.setExaminationResult,
  );

  const [nextRoute, setNextRoute] = useState<string>();
  const examinationForm = useProphylaxisSessionExaminationForm({
    examinationResult: participant.result,
    note: participant.note,
    onSubmit: (examinationResult) => {
      setExaminationResult(participant.childId, examinationResult);
      if (isDefined(nextRoute)) {
        setNextRoute(undefined);
        router.push(nextRoute);
      }
    },
  });
  const examinationNavigation = useProphylaxisSessionExaminationNavigation({
    participantIndex,
    participantsLength: filteredParticipants.length,
    onNavigate: (nextRoute) => {
      setNextRoute(nextRoute);
      void examinationForm.submitForm();
    },
  });

  return (
    <StickyToolbarLayout
      toolbar={
        <ProphylaxisSessionExaminationToolbar
          prophylaxisSessionId={prophylaxisSessionId}
          participant={participant}
          participantIndex={participantIndex}
          onBackClicked={examinationNavigation.gotoOverview}
        />
      }
    >
      <ProphylaxisSessionExaminationForm
        form={examinationForm}
        bottomBar={
          <ProphylaxisSessionExaminationBottomBar
            onPreviousParticipantClicked={
              examinationNavigation.gotoPreviousParticipant
            }
            onNextParticipantClicked={examinationNavigation.gotoNextParticipant}
            onOverviewClicked={examinationNavigation.gotoOverview}
          />
        }
      >
        <ExaminationFormLayout
          additionalInformation={
            <AdditionalInformationFormSection
              screening={isScreening}
              fluoridation={isDefined(fluoridationVarnish)}
              fluoridationConsentGiven={participant.fluoridationConsentGiven}
              components={ADDITIONAL_INFO_FORM_COMPONENTS}
            />
          }
          note={<NoteFormSection />}
        />
      </ProphylaxisSessionExaminationForm>
    </StickyToolbarLayout>
  );
}
