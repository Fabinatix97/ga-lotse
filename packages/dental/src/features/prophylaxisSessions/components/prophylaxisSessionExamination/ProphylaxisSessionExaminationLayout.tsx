/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";

import { AdditionalInformationFormSection } from "@/components/examination/AdditionalInformationFormSection";
import { ExaminationChildDetailsSection } from "@/components/examination/ExaminationChildDetailsSection";
import { ExaminationFormLayout } from "@/components/examination/ExaminationFormLayout";
import { ExaminationFormSection } from "@/components/examination/ExaminationFormSection";
import { NoteFormSection } from "@/components/examination/NoteFormSection";
import { ProphylaxisSessionExamination } from "@/features/prophylaxisSessions/api/models/ProphylaxisSessionExamination";
import { ProphylaxisSessionExaminationBottomBar } from "@/features/prophylaxisSessions/components/prophylaxisSessionExamination/ProphylaxisSessionExaminationBottomBar";
import { ProphylaxisSessionExaminationForm } from "@/features/prophylaxisSessions/components/prophylaxisSessionExamination/ProphylaxisSessionExaminationForm";
import { ProphylaxisSessionExaminationToolbar } from "@/features/prophylaxisSessions/components/prophylaxisSessionExamination/ProphylaxisSessionExaminationToolbar";
import { useParticipantNavigation } from "@/features/prophylaxisSessions/hooks/useParticipantNavigation";
import { useProphylaxisSessionExaminationForm } from "@/features/prophylaxisSessions/hooks/useProphylaxisSessionExaminationForm";
import {
  useFilteredPresentParticipants,
  useProphylaxisSessionStore,
} from "@/features/prophylaxisSessions/stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

interface ProphylaxisSessionExaminationLayoutProps {
  participant: ProphylaxisSessionExamination;
  participantsLength: number;
}

export function ProphylaxisSessionExaminationLayout(
  props: ProphylaxisSessionExaminationLayoutProps,
) {
  const { participant } = props;
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

  const examinationForm = useProphylaxisSessionExaminationForm({
    initialValues: participant,
    onSubmit: (values) =>
      setExamination(participant.examinationId, values.result, values.note),
  });

  const presentFilteredParticipants = useFilteredPresentParticipants();

  const examinationNavigation = useParticipantNavigation({
    participants: presentFilteredParticipants,
    examinationId: participant.examinationId,
    onNavigate: (nextRoute) => router.push(nextRoute),
    onSubmit: examinationForm.submitForm,
  });

  const isPresent = participant.status !== "NOT_PRESENT";

  return (
    <StickyToolbarLayout
      toolbar={
        <ProphylaxisSessionExaminationToolbar
          prophylaxisSessionId={prophylaxisSessionId}
          participant={participant}
          onBackClicked={examinationNavigation.gotoOverview}
        />
      }
      bottomToolbar={
        <ProphylaxisSessionExaminationBottomBar
          onPreviousParticipantClicked={
            isPresent
              ? examinationNavigation.gotoPreviousParticipant
              : undefined
          }
          onNextParticipantClicked={
            isPresent ? examinationNavigation.gotoNextParticipant : undefined
          }
          onOverviewClicked={examinationNavigation.gotoOverview}
          examination={participant}
          examinationFormValues={examinationForm.values}
        />
      }
    >
      <ProphylaxisSessionExaminationForm form={examinationForm}>
        <ExaminationFormLayout
          childInformation={
            <ExaminationChildDetailsSection
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
              previousExaminations={participant.previousExaminations}
            />
          }
          dentalExamination={
            isScreening ? <ExaminationFormSection /> : undefined
          }
          note={<NoteFormSection />}
        />
      </ProphylaxisSessionExaminationForm>
    </StickyToolbarLayout>
  );
}
