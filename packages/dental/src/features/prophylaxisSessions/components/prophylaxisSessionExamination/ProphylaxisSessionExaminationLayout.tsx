/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { StickyToolbarLayout } from "@eshg/lib-employee-portal";

import { ExaminationFormLayout } from "../../../../components/examination/ExaminationFormLayout";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";
import { useParticipantNavigation } from "../../hooks/useParticipantNavigation";
import { useProphylaxisSessionExaminationForm } from "../../hooks/useProphylaxisSessionExaminationForm";
import {
  useFilteredPresentParticipants,
  useProphylaxisSessionStore,
} from "../../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

import { ProphylaxisSessionExaminationBottomBar } from "./ProphylaxisSessionExaminationBottomBar";
import { ProphylaxisSessionExaminationForm } from "./ProphylaxisSessionExaminationForm";
import { ProphylaxisSessionExaminationToolbar } from "./ProphylaxisSessionExaminationToolbar";

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
  const isFluoridation = isDefined(fluoridationVarnish);
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
          status={participant.status}
          onBackClicked={examinationNavigation.gotoOverview}
        />
      }
      bottomToolbar={
        <ProphylaxisSessionExaminationBottomBar
          examination={participant}
          examinationFormValues={examinationForm.values}
          onPreviousParticipantClicked={
            isPresent
              ? examinationNavigation.gotoPreviousParticipant
              : undefined
          }
          onNextParticipantClicked={
            isPresent ? examinationNavigation.gotoNextParticipant : undefined
          }
          onOverviewClicked={examinationNavigation.gotoOverview}
        />
      }
    >
      <ProphylaxisSessionExaminationForm form={examinationForm}>
        <ExaminationFormLayout
          isScreening={isScreening}
          isFluoridation={isFluoridation}
          isFluoridationConsentGiven={
            participant.currentFluoridationConsent?.consented
          }
          dateAndTime={dateOfExamination}
          groupName={participant.groupName ?? ""}
          institutionName={participant.institutionName}
          childId={participant.childId}
          child={participant}
          previousExaminations={participant.previousExaminations}
        />
      </ProphylaxisSessionExaminationForm>
    </StickyToolbarLayout>
  );
}
