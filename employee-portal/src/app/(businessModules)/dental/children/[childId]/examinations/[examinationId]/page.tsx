/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { getExaminationQuery } from "@eshg/dental/api/queries/childApi";
import { useDentalApi } from "@eshg/dental/shared/DentalProvider";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { ChildExaminationForm } from "@/lib/businessModules/dental/features/children/details/ChildExaminationForm";
import { AdditionalInformationFormSection } from "@/lib/businessModules/dental/features/examinations/AdditionalInformationFormSection";
import { ExaminationFormLayout } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { NoteFormSection } from "@/lib/businessModules/dental/features/examinations/NoteFormSection";
import { DentalExaminationFormSection } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/DentalExaminationFormSection";
import { DentalExaminationStoreProvider } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";

export default function ExaminationDetailsPage(props: DentalChildPageProps) {
  const { childApi } = useDentalApi();
  const examinationId = props.params.examinationId;
  const { data: examination } = useSuspenseQuery(
    getExaminationQuery(childApi, examinationId),
  );

  return (
    <DentalExaminationStoreProvider examinationResult={examination.result}>
      <ChildExaminationForm examination={examination}>
        <ExaminationFormLayout
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
