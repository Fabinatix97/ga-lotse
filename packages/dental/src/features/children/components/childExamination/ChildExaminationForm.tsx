/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormikProvider, useFormik } from "formik";

import {
  ApiExaminationResult,
  UpdateExaminationRequest,
} from "@eshg/dental-api";
import {
  FormFooter,
  FormStack,
  useConfirmLeaveDirtyFormEffect,
} from "@eshg/lib-employee-portal";
import {
  RequiresChildren,
  mapOptionalValue,
  mapRequiredValue,
  useAlert,
} from "@eshg/lib-portal";

import { ToothDiagnoses } from "../../../../api/models/ExaminationResult";
import { useExaminationStore } from "../../../../stores/examination/ExaminationStoreProvider";
import { INVALID_EXAMINATION_RESULT_VALIDATION_ERROR } from "../../../../translations/examination";
import { ExaminationFormValues } from "../../../../types/examination";
import {
  mapToExaminationFormValues,
  mapToothDiagnosesToRequest,
} from "../../../../utils/examination";
import { ChildExamination } from "../../api/models/ChildExamination";
import { useUpdateExamination } from "../../api/mutations/details";

interface ChildExaminationFormProps extends RequiresChildren {
  examination: ChildExamination;
}

export function ChildExaminationForm(props: ChildExaminationFormProps) {
  const { examination } = props;
  const submitExamination = useExaminationStore((state) => state.submit);
  const isExaminationDirty = useExaminationStore((state) => state.dirty);
  const updateExamination = useUpdateExamination(examination.id);
  const alert = useAlert();
  const form = useFormik({
    initialValues: mapToExaminationFormValues(
      examination.result,
      examination.note,
      examination.prophylaxisDentitionType,
    ),
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const isDirty = form.dirty || isExaminationDirty;
  useConfirmLeaveDirtyFormEffect(isDirty);

  async function handleSubmit(values: ExaminationFormValues) {
    alert.close();
    const examinationResult = submitExamination();

    if (examinationResult.isValid) {
      await updateExamination.mutateAsync(
        mapToRequest(examination, values, examinationResult.toothDiagnoses),
      );
    } else {
      alert.error({
        message: INVALID_EXAMINATION_RESULT_VALIDATION_ERROR,
        closeable: true,
      });
    }
  }

  return (
    <FormikProvider value={form}>
      <FormStack onSubmit={form.handleSubmit}>
        {props.children}
        <FormFooter isSubmitting={form.isSubmitting} />
      </FormStack>
    </FormikProvider>
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
      fluorideVarnishApplied: mapOptionalValue(
        formValues.fluorideVarnishApplied,
      ),
      plaque: formValues.plaque,
      calculus: formValues.calculus,
      gingivitis: formValues.gingivitis,
      parodontitis: formValues.parodontitis,
      toothDiagnoses: mapToothDiagnosesToRequest(toothDiagnoses),
      individualProphylaxis: formValues.individualProphylaxis,
      fissureSealing: formValues.fissureSealing,
      tartarRemoval: formValues.tartarRemoval,
      gingivitisTreatment: formValues.gingivitisTreatment,
      orthodonticTreatment: formValues.orthodonticTreatment,
      plaqueTreatment: formValues.plaqueTreatment,
      inspectionAppointment: formValues.inspectionAppointment,
    };
  }

  if (examination.fluoridation) {
    return {
      type: "FluoridationExaminationResult",
      fluorideVarnishApplied: mapOptionalValue(
        formValues.fluorideVarnishApplied,
      ),
    };
  }

  return undefined;
}
