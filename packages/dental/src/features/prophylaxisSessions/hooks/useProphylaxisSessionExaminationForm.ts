/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormik } from "formik";

import { ApiDentitionType } from "@eshg/dental-api";
import { mapOptionalValue, mapRequiredValue, useAlert } from "@eshg/lib-portal";

import {
  ExaminationResult,
  ScreeningExaminationResult,
  ToothDiagnoses,
} from "../../../api/models/ExaminationResult";
import { useExaminationStore } from "../../../stores/examination/ExaminationStoreProvider";
import { INVALID_EXAMINATION_RESULT_VALIDATION_ERROR } from "../../../translations/examination";
import { ExaminationFormValues } from "../../../types/examination";
import { mapToExaminationFormValues } from "../../../utils/examination";

interface ExaminationInputValues {
  result?: ExaminationResult;
  note?: string;
  prophylaxisDentitionType?: ApiDentitionType;
}

interface ExaminationOutputValues {
  result?: ExaminationResult;
  note?: string;
}

interface UseProphylaxisSessionExaminationFormParams {
  initialValues: ExaminationInputValues;
  onSubmit: (values: ExaminationOutputValues) => void;
}

export function useProphylaxisSessionExaminationForm(
  params: UseProphylaxisSessionExaminationFormParams,
) {
  const { initialValues, onSubmit } = params;

  const isDentalExaminationDirty = useExaminationStore((state) => state.dirty);
  const submitDentalExamination = useExaminationStore((state) => state.submit);
  const alert = useAlert();

  const form = useFormik({
    initialValues: mapToExaminationFormValues(
      initialValues.result,
      initialValues.note,
      initialValues.prophylaxisDentitionType,
    ),
    onSubmit: (formValues: ExaminationFormValues) => {
      alert.close();

      if (!(form.dirty || isDentalExaminationDirty)) {
        return;
      }

      const dentalExaminationResult = submitDentalExamination();

      if (dentalExaminationResult.isValid) {
        onSubmit(
          mapToScreeningExaminationValues(
            formValues,
            dentalExaminationResult.toothDiagnoses,
          ),
        );
      } else {
        alert.error({
          message: INVALID_EXAMINATION_RESULT_VALIDATION_ERROR,
          closeable: true,
        });
        // prevent navigation
        throw new Error("Dental examination contains invalid results.");
      }
    },
    enableReinitialize: true,
  });

  return form;
}

function mapToScreeningExaminationValues(
  formValues: ExaminationFormValues,
  toothDiagnoses: ToothDiagnoses,
): ExaminationOutputValues {
  return {
    result: mapToScreeningExaminationResult(formValues, toothDiagnoses),
    note: mapOptionalValue(formValues.note),
  };
}

function mapToScreeningExaminationResult(
  formValues: ExaminationFormValues,
  toothDiagnoses: ToothDiagnoses,
): ScreeningExaminationResult {
  return {
    type: "screening",
    dentitionType: mapRequiredValue(formValues.dentitionType),
    oralHygieneStatus: mapOptionalValue(formValues.oralHygieneStatus),
    mihStatus: mapOptionalValue(formValues.mihStatus),
    orthodonticFindings: formValues.orthodonticFindings ?? [],
    orthodonticStatus: mapOptionalValue(formValues.orthodonticStatus),
    fluorideVarnishApplied: mapOptionalValue(formValues.fluorideVarnishApplied),
    plaque: formValues.plaque,
    calculus: formValues.calculus,
    gingivitis: formValues.gingivitis,
    parodontitis: formValues.parodontitis,
    blackStain: formValues.blackStain,
    toothDiagnoses: toothDiagnoses,
    individualProphylaxis: formValues.individualProphylaxis,
    fissureSealing: formValues.fissureSealing,
    tartarRemoval: formValues.tartarRemoval,
    gingivitisTreatment: formValues.gingivitisTreatment,
    orthodonticTreatment: formValues.orthodonticTreatment,
    plaqueTreatment: formValues.plaqueTreatment,
    primaryDentitionObstructsSecondary:
      formValues.primaryDentitionObstructsSecondary,
    inspectionAppointment: formValues.inspectionAppointment,
  };
}
