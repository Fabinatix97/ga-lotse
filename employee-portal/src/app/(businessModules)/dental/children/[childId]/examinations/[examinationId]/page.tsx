/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { UpdateExaminationRequest } from "@eshg/employee-portal-api/dental";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import { Examination } from "@/lib/businessModules/dental/api/models/Examination";
import { useUpdateExamination } from "@/lib/businessModules/dental/api/mutations/childApi";
import { getExaminationQuery } from "@/lib/businessModules/dental/api/queries/childApi";
import {
  ExaminationDetails,
  ExaminationFormValues,
} from "@/lib/businessModules/dental/features/children/details/ExaminationDetails";

export default function ExaminationDetailsPage(props: DentalChildPageProps) {
  const childApi = useChildApi();
  const examinationId = props.params.examinationId;
  const { data: examination } = useSuspenseQuery(
    getExaminationQuery(childApi, examinationId),
  );
  const updateExamination = useUpdateExamination(examinationId);
  async function handleSubmit(values: ExaminationFormValues) {
    await updateExamination.mutateAsync(
      mapToRequest(examinationId, values, examination.version),
    );
  }

  return (
    <ExaminationDetails
      initialValues={mapToFormValues(examination)}
      onSubmit={handleSubmit}
    />
  );
}

function mapToFormValues(apiExamination: Examination): ExaminationFormValues {
  return { note: parseOptionalValue(apiExamination.note) };
}

function mapToRequest(
  examinationId: string,
  formValues: ExaminationFormValues,
  version: number,
): UpdateExaminationRequest {
  return {
    examinationId,
    apiUpdateExaminationRequest: {
      version,
      note: mapOptionalValue(formValues.note),
    },
  };
}
