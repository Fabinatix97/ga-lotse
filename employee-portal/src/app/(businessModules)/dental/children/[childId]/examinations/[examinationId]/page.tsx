/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  getChildDetailsQuery,
  getExaminationQuery,
} from "@eshg/dental/api/queries/childApi";
import { useDentalApi } from "@eshg/dental/shared/DentalProvider";
import { useSuspenseQueries } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { ChildExaminationForm } from "@/lib/businessModules/dental/features/children/details/ChildExaminationForm";
import { AdditionalInformationFormSection } from "@/lib/businessModules/dental/features/examinations/AdditionalInformationFormSection";
import { ChildDetailsSection } from "@/lib/businessModules/dental/features/examinations/ChildDetailsSection";
import { ExaminationFormLayout } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { NoteFormSection } from "@/lib/businessModules/dental/features/examinations/NoteFormSection";
import { DentalExaminationFormSection } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/DentalExaminationFormSection";
import { DentalExaminationStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";

export default function ExaminationDetailsPage(props: DentalChildPageProps) {
  const { childApi } = useDentalApi();
  const examinationId = props.params.examinationId;
  const childId = props.params.childId;
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
