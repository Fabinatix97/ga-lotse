/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { ExaminationResultWithDate } from "../../../api/models/ExaminationResult";
import { ExaminationFormLayout } from "../../../components/examination/ExaminationFormLayout";
import { useDentalApi } from "../../../contexts/dental";
import { ExaminationStoreProvider } from "../../../stores/examination/ExaminationStoreProvider";
import { ChildExamination } from "../api/models/ChildExamination";
import {
  getChildDetailsQuery,
  getExaminationQuery,
} from "../api/queries/details";
import { ChildExaminationForm } from "../components/childExamination/ChildExaminationForm";
import { DentalChildExaminationRouteParams } from "../schemas/DentalChildExaminationRouteParams";

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
          isScreening={examination.screening}
          isFluoridation={examination.fluoridation}
          isFluoridationConsentGiven={examination.fluoridationConsentGiven}
          dateAndTime={examination.dateAndTime}
          institution={institutionAtExaminationDate?.institution}
          groupName={institutionAtExaminationDate?.groupName}
          child={child}
          previousExaminations={mapPreviousExaminations(child.examinations)}
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
