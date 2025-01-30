/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiExaminationResult,
  UpdateExaminationRequest,
} from "@eshg/dental-api";
import { Examination } from "@eshg/dental/api/models/Examination";
import { useUpdateExamination } from "@eshg/dental/api/mutations/childApi";
import { getExaminationQuery } from "@eshg/dental/api/queries/childApi";
import { useDentalApi } from "@eshg/dental/shared/DentalProvider";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DentalChildPageProps } from "@/app/(businessModules)/dental/children/[childId]/layout";
import { ChildExaminationForm } from "@/lib/businessModules/dental/features/children/details/ChildExaminationForm";
import { AdditionalInformationFormSection } from "@/lib/businessModules/dental/features/examinations/AdditionalInformationFormSection";
import {
  ExaminationFormLayout,
  ExaminationFormValues,
  mapToExaminationFormValues,
} from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { NoteFormSection } from "@/lib/businessModules/dental/features/examinations/NoteFormSection";

export default function ExaminationDetailsPage(props: DentalChildPageProps) {
  const { childApi } = useDentalApi();
  const examinationId = props.params.examinationId;
  const { data: examination } = useSuspenseQuery(
    getExaminationQuery(childApi, examinationId),
  );
  const updateExamination = useUpdateExamination(examinationId);

  async function handleSubmit(values: ExaminationFormValues) {
    await updateExamination.mutateAsync(
      mapToRequest(examination, values, examination.version),
    );
  }

  return (
    <ChildExaminationForm
      initialValues={mapToExaminationFormValues(
        examination.result,
        examination.note,
      )}
      onSubmit={handleSubmit}
    >
      <ExaminationFormLayout
        additionalInformation={
          <AdditionalInformationFormSection
            screening={examination.screening}
            fluoridation={examination.fluoridation}
            fluoridationConsentGiven={examination.fluoridationConsentGiven}
          />
        }
        note={<NoteFormSection />}
      />
    </ChildExaminationForm>
  );
}

function mapToRequest(
  examination: Examination,
  formValues: ExaminationFormValues,
  version: number,
): UpdateExaminationRequest {
  return {
    examinationId: examination.id,
    apiUpdateExaminationRequest: {
      version,
      note: mapOptionalValue(formValues.note),
      result: mapExaminationResultRequest(examination, formValues),
    },
  };
}

function mapExaminationResultRequest(
  examination: Examination,
  formValues: ExaminationFormValues,
): ApiExaminationResult | undefined {
  if (examination.screening) {
    return {
      type: "ScreeningExaminationResult",
      oralHygieneStatus: mapOptionalValue(formValues.oralHygieneStatus),
      fluorideVarnishApplied:
        mapOptionalValue(formValues.fluorideVarnishApplied) ?? false,
      toothDiagnoses: [],
    };
  }

  if (examination.fluoridation) {
    return {
      type: "FluoridationExaminationResult",
      fluorideVarnishApplied: mapRequiredValue(
        formValues.fluorideVarnishApplied,
      ),
    };
  }

  return undefined;
}
