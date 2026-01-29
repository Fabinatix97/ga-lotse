/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import {
  ScreeningExaminationResult,
  ScreeningExaminationResultWithDate,
} from "../../../api/models/ExaminationResult";
import { useDentalApi } from "../../../contexts/dental";
import { ExaminationStoreProvider } from "../../../stores/examination/ExaminationStoreProvider";
import { ChildExamination } from "../api/models/ChildExamination";
import {
  getChildDetailsQuery,
  getExaminationQuery,
} from "../api/queries/details";
import { ChildExaminationFormLayout } from "../components/childExamination/ChildExaminationFormLayout";
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

  const allScreeningExaminations = mapPreviousScreeningExaminations(
    child.examinations,
  );

  const previousScreeningExaminations = allScreeningExaminations.filter(
    (e) => e.dateAndTime < examination.dateAndTime,
  );

  return (
    <ExaminationStoreProvider
      examinationResult={examination.result}
      defaultDentitionType={examination.prophylaxisDentitionType}
      previousExaminationResult={
        previousScreeningExaminations.length > 0
          ? previousScreeningExaminations[0]
          : undefined
      }
    >
      <ChildExaminationFormLayout
        childId={childId}
        examinationId={examinationId}
      />
    </ExaminationStoreProvider>
  );
}

function mapPreviousScreeningExaminations(
  response: ChildExamination[],
): ScreeningExaminationResultWithDate[] {
  return response
    .filter((e) => e.result?.type === "screening" && e.result !== null)
    .map((examination) => ({
      result: examination.result as ScreeningExaminationResult,
      dateAndTime: examination.dateAndTime,
    }));
}
