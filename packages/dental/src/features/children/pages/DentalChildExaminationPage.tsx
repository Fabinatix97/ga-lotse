/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { ExaminationResultWithDate } from "@/api/models/ExaminationResult";
import { AdditionalInformationFormSection } from "@/components/examination/AdditionalInformationFormSection";
import { ExaminationChildDetailsSection } from "@/components/examination/ExaminationChildDetailsSection";
import { ExaminationFormLayout } from "@/components/examination/ExaminationFormLayout";
import { ExaminationFormSection } from "@/components/examination/ExaminationFormSection";
import { NoteFormSection } from "@/components/examination/NoteFormSection";
import { useDentalApi } from "@/contexts/dental";
import { ChildExamination } from "@/features/children/api/models/ChildExamination";
import {
  getChildDetailsQuery,
  getExaminationQuery,
} from "@/features/children/api/queries/details";
import { ChildExaminationForm } from "@/features/children/components/childExamination/ChildExaminationForm";
import { DentalChildExaminationRouteParams } from "@/features/children/schemas/DentalChildExaminationRouteParams";
import { ExaminationStoreProvider } from "@/stores/examination/ExaminationStoreProvider";

export function DentalChildExaminationPage(
  props: DynamicPageProps<DentalChildExaminationRouteParams>,
) {
  const { childId, examinationId } = use(props.params);
  const { childApi } = useDentalApi();
  const [{ data: examination }, { data: child }] = useSuspenseQueries({
    queries: [
      getExaminationQuery(childApi, examinationId),
      getChildDetailsQuery(childApi, childId),
    ],
  });
  const institutionAtExaminationDate = child.institutions.find(
    (institution) => institution.year === examination.dateAndTime.getFullYear(),
  );

  return (
    <ExaminationStoreProvider
      examinationResult={examination.result}
      defaultDentitionType={examination.prophylaxisDentitionType}
    >
      <ChildExaminationForm examination={examination}>
        <ExaminationFormLayout
          childInformation={
            <ExaminationChildDetailsSection
              firstName={child.firstName}
              lastName={child.lastName}
              dateOfBirth={child.dateOfBirth}
              dateOfExamination={examination.dateAndTime}
              groupName={institutionAtExaminationDate?.groupName ?? ""}
              allFluoridationConsents={child.allFluoridationConsents}
            />
          }
          additionalInformation={
            <AdditionalInformationFormSection
              screening={examination.screening}
              fluoridation={examination.fluoridation}
              fluoridationConsentGiven={examination.fluoridationConsentGiven}
              status={examination.status}
              dateOfExamination={examination.dateAndTime}
              participantDateOfBirth={child.dateOfBirth}
              previousExaminations={mapPreviousExaminations(child.examinations)}
            />
          }
          dentalExamination={
            examination.screening ? <ExaminationFormSection /> : undefined
          }
          note={<NoteFormSection />}
        />
      </ChildExaminationForm>
    </ExaminationStoreProvider>
  );
}

function mapPreviousExaminations(
  response: ChildExamination[],
): ExaminationResultWithDate[] {
  return response.map((examination) => ({
    result: examination.result,
    dateAndTime: examination.dateAndTime,
  }));
}
