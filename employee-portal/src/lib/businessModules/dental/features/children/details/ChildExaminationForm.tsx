/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ChildExamination,
  ToothDiagnoses,
  useUpdateExamination,
} from "@eshg/dental";
import {
  ApiExaminationResult,
  UpdateExaminationRequest,
} from "@eshg/dental-api";
import { useAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Formik } from "formik";

import {
  ExaminationFormValues,
  mapToExaminationFormValues,
} from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { INVALID_EXAMINATION_RESULT_VALIDATION_ERROR } from "@/lib/businessModules/dental/features/examinations/translations";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { FormStack } from "@/lib/shared/components/form/FormStack";

interface ChildExaminationFormProps extends RequiresChildren {
  examination: ChildExamination;
}

export function ChildExaminationForm(props: ChildExaminationFormProps) {
  const { examination } = props;
  const submitDentalExamination = useDentalExaminationStore(
    (state) => state.submit,
  );
  const updateExamination = useUpdateExamination(examination.id);
  const alert = useAlert();

  async function handleSubmit(values: ExaminationFormValues) {
    alert.close();
    const dentalExaminationResult = submitDentalExamination();

    if (dentalExaminationResult.isValid) {
      await updateExamination.mutateAsync(
        mapToRequest(
          examination,
          values,
          dentalExaminationResult.toothDiagnoses,
        ),
      );
    } else {
      alert.error({
        message: INVALID_EXAMINATION_RESULT_VALIDATION_ERROR,
        closeable: true,
      });
    }
  }

  return (
    <Formik
      initialValues={mapToExaminationFormValues(
        examination.result,
        examination.note,
        examination.prophylaxisDentitionType,
      )}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <FormStack onSubmit={handleSubmit}>
            {props.children}
            <FormFooter isSubmitting={isSubmitting} />
          </FormStack>
        );
      }}
    </Formik>
  );
}

function mapToRequest(
  examination: ChildExamination,
  formValues: ExaminationFormValues,
  toothDiagnoses: ToothDiagnoses,
): UpdateExaminationRequest {
  return {
    examinationId: examination.id,
    apiUpdateExaminationRequest: {
      version: examination.version,
      note: mapOptionalValue(formValues.note),
      result: mapExaminationResultRequest(
        examination,
        formValues,
        toothDiagnoses,
      ),
    },
  };
}

function mapExaminationResultRequest(
  examination: ChildExamination,
  formValues: ExaminationFormValues,
  toothDiagnoses: ToothDiagnoses,
): ApiExaminationResult | undefined {
  if (examination.screening) {
    return {
      type: "ScreeningExaminationResult",
      dentitionType: mapRequiredValue(formValues.dentitionType),
      oralHygieneStatus: mapOptionalValue(formValues.oralHygieneStatus),
      mihStatus: mapOptionalValue(formValues.mihStatus),
      orthodonticFindings: formValues.orthodonticFindings ?? [],
      orthodonticStatus: mapOptionalValue(formValues.orthodonticStatus),
      fluorideVarnishApplied:
        mapOptionalValue(formValues.fluorideVarnishApplied) ?? false,
      plaque: formValues.plaque,
      calculus: formValues.calculus,
      gingivitis: formValues.gingivitis,
      parodontitis: formValues.parodontitis,
      toothDiagnoses: Object.values(toothDiagnoses),
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
