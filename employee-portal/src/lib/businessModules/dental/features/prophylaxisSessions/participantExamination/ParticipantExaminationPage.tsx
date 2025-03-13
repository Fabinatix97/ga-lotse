/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildExamination } from "@eshg/dental";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isDefined } from "remeda";

import { AdditionalInformationFormSection } from "@/lib/businessModules/dental/features/examinations/AdditionalInformationFormSection";
import { ChildDetailsSection } from "@/lib/businessModules/dental/features/examinations/ChildDetailsSection";
import { ExaminationFormLayout } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { NoteFormSection } from "@/lib/businessModules/dental/features/examinations/NoteFormSection";
import { DentalExaminationFormSection } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/DentalExaminationFormSection";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { ParticipantExaminationBottomBar } from "@/lib/businessModules/dental/features/prophylaxisSessions/participantExamination/ParticipantExaminationBottomBar";
import { ParticipantExaminationForm } from "@/lib/businessModules/dental/features/prophylaxisSessions/participantExamination/ParticipantExaminationForm";
import { ParticipantExaminationToolbar } from "@/lib/businessModules/dental/features/prophylaxisSessions/participantExamination/ParticipantExaminationToolbar";
import { useParticipantExaminationForm } from "@/lib/businessModules/dental/features/prophylaxisSessions/participantExamination/useParticipantExaminationForm";
import { useParticipantNavigation } from "@/lib/businessModules/dental/features/prophylaxisSessions/participantExamination/useParticipantNavigation";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

interface ParticipantExaminationPageProps {
  participant: ChildExamination;
  participantIndex: number;
  participantsLength: number;
}

export function ParticipantExaminationPage(
  props: ParticipantExaminationPageProps,
) {
  const { participant, participantIndex, participantsLength } = props;
  const router = useRouter();
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const dateOfExamination = useProphylaxisSessionStore(
    (state) => state.dateAndTime,
  );
  const isScreening = useProphylaxisSessionStore((state) => state.isScreening);
  const fluoridationVarnish = useProphylaxisSessionStore(
    (state) => state.fluoridationVarnish,
  );
  const setExamination = useProphylaxisSessionStore(
    (state) => state.setExamination,
  );
  const isDentalExaminationDirty = useDentalExaminationStore(
    (state) => state.dirty,
  );

  const [nextRoute, setNextRoute] = useState<string>();
  const examinationForm = useParticipantExaminationForm({
    initialValues: participant,
    onSubmit: (values) => {
      try {
        if (examinationForm.dirty || isDentalExaminationDirty) {
          setExamination(participant.examinationId, values.result, values.note);
        }
        if (isDefined(nextRoute)) {
          router.push(nextRoute);
        }
      } catch {
        // TODO handle invalid tooth diagnoses
      } finally {
        setNextRoute(undefined);
      }
    },
  });
  const examinationNavigation = useParticipantNavigation({
    participantIndex,
    participantsLength,
    onNavigate: (nextRoute) => {
      setNextRoute(nextRoute);
      void examinationForm.submitForm();
    },
  });

  return (
    <StickyToolbarLayout
      toolbar={
        <ParticipantExaminationToolbar
          prophylaxisSessionId={prophylaxisSessionId}
          participant={participant}
          participantIndex={participantIndex}
          onBackClicked={examinationNavigation.gotoOverview}
        />
      }
      bottomToolbar={
        <ParticipantExaminationBottomBar
          onPreviousParticipantClicked={
            examinationNavigation.gotoPreviousParticipant
          }
          onNextParticipantClicked={examinationNavigation.gotoNextParticipant}
          onOverviewClicked={examinationNavigation.gotoOverview}
          examination={participant}
          examinationFormValues={examinationForm.values}
        />
      }
    >
      <ParticipantExaminationForm form={examinationForm}>
        <ExaminationFormLayout
          childInformation={
            <ChildDetailsSection
              firstName={participant.firstName}
              lastName={participant.lastName}
              dateOfBirth={participant.dateOfBirth}
              dateOfExamination={dateOfExamination}
              groupName={participant.groupName}
              allFluoridationConsents={participant.allFluoridationConsents}
            />
          }
          additionalInformation={
            <AdditionalInformationFormSection
              screening={isScreening}
              fluoridation={isDefined(fluoridationVarnish)}
              fluoridationConsentGiven={
                participant.currentFluoridationConsent?.consented
              }
              status={participant.status}
              participantDateOfBirth={participant.dateOfBirth}
              dateOfExamination={dateOfExamination}
            />
          }
          dentalExamination={
            isScreening ? <DentalExaminationFormSection /> : undefined
          }
          note={<NoteFormSection />}
        />
      </ParticipantExaminationForm>
    </StickyToolbarLayout>
  );
}
