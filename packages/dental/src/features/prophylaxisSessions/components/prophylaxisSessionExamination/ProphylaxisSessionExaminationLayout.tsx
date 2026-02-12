/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { ApiBooleanWithUnknown } from "@eshg/dental-api";
import {
  StickyToolbarLayout,
  useConfirmLeaveDirtyFormEffect,
} from "@eshg/lib-employee-portal";

import { ExaminationFormLayout } from "../../../../components/examination/ExaminationFormLayout";
import { useExaminationStore } from "../../../../stores/examination/ExaminationStoreProvider";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";
import { useParticipantNavigation } from "../../hooks/useParticipantNavigation";
import { useProphylaxisSessionExaminationForm } from "../../hooks/useProphylaxisSessionExaminationForm";
import { useProphylaxisSessionStore } from "../../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

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

  const isExaminationDirty = useExaminationStore((state) => state.dirty);
  const isDirty = examinationForm.dirty || isExaminationDirty;
  // Does the prophylaxis session have accepted but unsaved examination data?
  const hasChangedExaminations = useProphylaxisSessionStore(
    (state) => state.changedExaminationsById.size > 0,
  );
  useConfirmLeaveDirtyFormEffect(isDirty || hasChangedExaminations);

  const participantsToBeExamined = useProphylaxisSessionStore(
    (state) => state.participantsToBeExamined,
  );

  const examinationNavigation = useParticipantNavigation({
    participants: participantsToBeExamined,
    examinationId: participant.examinationId,
    onNavigate: (nextRoute) => router.push(nextRoute),
    onSubmit: examinationForm.submitForm,
  });

  const isToBeExamined =
    participantsToBeExamined.find((p) => p.id === participant.id) !== undefined;

  function isFluoridationConsentCurrentlyGiven() {
    if (participant.currentFluoridationConsent === undefined) {
      return false;
    }
    const relevantConsents = participant.allFluoridationConsents.filter(
      (fluoridationConsent) =>
        fluoridationConsent.dateOfConsent <= dateOfExamination,
    );
    return relevantConsents[0]?.consented === ApiBooleanWithUnknown.True;
  }

  return (
    <StickyToolbarLayout
      toolbar={
        <ProphylaxisSessionExaminationToolbar
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
            isToBeExamined
              ? examinationNavigation.gotoPreviousParticipant
              : undefined
          }
          onNextParticipantClicked={
            isToBeExamined
              ? examinationNavigation.gotoNextParticipant
              : undefined
          }
          onOverviewClicked={examinationNavigation.gotoOverview}
        />
      }
    >
      <ProphylaxisSessionExaminationForm form={examinationForm}>
        <ExaminationFormLayout
          isScreening={isScreening}
          isFluoridation={isFluoridation}
          isFluoridationConsentGiven={isFluoridationConsentCurrentlyGiven()}
          dateAndTime={dateOfExamination}
          groupName={participant.groupName ?? ""}
          institution={participant.institution}
          child={participant}
          previousExaminations={participant.previousScreeningExaminations}
          showChildDetails
        />
      </ProphylaxisSessionExaminationForm>
    </StickyToolbarLayout>
  );
}
