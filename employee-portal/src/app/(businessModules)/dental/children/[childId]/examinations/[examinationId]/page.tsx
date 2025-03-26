/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ChildExamination,
  DentalChildExaminationRouteParams,
  ExaminationResultWithDate,
  getChildDetailsQuery,
  getExaminationQuery,
  useDentalApi,
} from "@eshg/dental";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { ChildExaminationForm } from "@/lib/businessModules/dental/features/children/details/ChildExaminationForm";
import { AdditionalInformationFormSection } from "@/lib/businessModules/dental/features/examinations/AdditionalInformationFormSection";
import { ChildDetailsSection } from "@/lib/businessModules/dental/features/examinations/ChildDetailsSection";
import { ExaminationFormLayout } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { NoteFormSection } from "@/lib/businessModules/dental/features/examinations/NoteFormSection";
import { DentalExaminationFormSection } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/DentalExaminationFormSection";
import { DentalExaminationStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";

export default function ExaminationDetailsPage(
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
    <DentalExaminationStoreProvider
      examinationResult={examination.result}
      defaultDentitionType={examination.prophylaxisDentitionType}
    >
      <ChildExaminationForm examination={examination}>
        <ExaminationFormLayout
          childInformation={
            <ChildDetailsSection
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
            examination.screening ? <DentalExaminationFormSection /> : undefined
          }
          note={<NoteFormSection />}
        />
      </ChildExaminationForm>
    </DentalExaminationStoreProvider>
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
