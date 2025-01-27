/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { UpdateExaminationRequest } from "@eshg/dental-api";
import {
  ApiExaminationResult,
  ApiFluoridationExaminationResult,
  ApiScreeningExaminationResult,
} from "@eshg/dental-api";
import { Examination } from "@eshg/dental/api/models/Examination";
import { useUpdateExamination } from "@eshg/dental/api/mutations/childApi";
import { getExaminationQuery } from "@eshg/dental/api/queries/childApi";
import { useDentalApi } from "@eshg/dental/shared/DentalProvider";
import {
  mapOptionalValue,
  mapRequiredValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import {
  ExaminationDetails,
  ExaminationFormValues,
} from "@/lib/businessModules/dental/features/children/details/ExaminationDetails";

export default function ExaminationDetailsPage(props: DentalChildPageProps) {
  const { childApi } = useDentalApi();
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
  return {
    screening: apiExamination.screening,
    fluoridation: apiExamination.fluoridation,
    note: parseOptionalValue(apiExamination.note),
    ...mapExaminationResultFormValues(apiExamination),
  };
}

function mapExaminationResultFormValues(apiExamination: Examination) {
  if (apiExamination.screening) {
    const screeningResult =
      apiExamination.result as ApiScreeningExaminationResult;
    return {
      oralHygieneStatus: parseOptionalValue(screeningResult?.oralHygieneStatus),
      fluorideVarnishApplied: parseOptionalValue(
        screeningResult?.fluorideVarnishApplied,
      ),
    };
  } else {
    const fluoridationResult =
      apiExamination.result as ApiFluoridationExaminationResult;
    return {
      fluorideVarnishApplied: parseOptionalValue(
        fluoridationResult?.fluorideVarnishApplied,
      ),
    };
  }
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
      result: mapExaminationResultRequest(formValues),
    },
  };
}

function mapExaminationResultRequest(
  formValues: ExaminationFormValues,
): ApiExaminationResult | undefined {
  if (formValues.screening) {
    return {
      type: "ScreeningExaminationResult",
      oralHygieneStatus: mapOptionalValue(formValues.oralHygieneStatus),
      fluorideVarnishApplied:
        mapOptionalValue(formValues.fluorideVarnishApplied) ?? false,
      toothDiagnoses: [],
    };
  } else if (formValues.fluoridation) {
    return {
      type: "FluoridationExaminationResult",
      fluorideVarnishApplied: mapRequiredValue(
        formValues.fluorideVarnishApplied,
      ),
    };
  }
}
