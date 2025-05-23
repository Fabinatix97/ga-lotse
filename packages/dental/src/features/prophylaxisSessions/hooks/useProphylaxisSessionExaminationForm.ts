/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormik } from "formik";

import { ApiDentitionType, ApiTooth } from "@eshg/dental-api";
import { mapOptionalValue, mapRequiredValue, useAlert } from "@eshg/lib-portal";

import {
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
} from "../../../api/models/ExaminationResult";
import { ToothDiagnosis } from "../../../api/models/ToothDiagnosis";
import { useExaminationStore } from "../../../stores/examination/ExaminationStoreProvider";
import { INVALID_EXAMINATION_RESULT_VALIDATION_ERROR } from "../../../translations/examination";
import { ExaminationFormValues } from "../../../types/examination";
import { mapToExaminationFormValues } from "../../../utils/examination";
import { useProphylaxisSessionStore } from "../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

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

  const isScreening = useProphylaxisSessionStore((state) => state.isScreening);
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
          mapToExaminationValues(
            isScreening,
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

function mapToExaminationValues(
  screening: boolean,
  formValues: ExaminationFormValues,
  toothDiagnoses: Partial<Record<ApiTooth, ToothDiagnosis>>,
): ExaminationOutputValues {
  return {
    result: mapToExaminationResult(screening, formValues, toothDiagnoses),
    note: mapOptionalValue(formValues.note),
  };
}

function mapToExaminationResult(
  screening: boolean,
  formValues: ExaminationFormValues,
  toothDiagnoses: Partial<Record<ApiTooth, ToothDiagnosis>>,
): ExaminationResult | undefined {
  if (screening) {
    return {
      type: "screening",
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
      toothDiagnoses: toothDiagnoses,
      individualProphylaxis: formValues.individualProphylaxis,
      fissureSealing: formValues.fissureSealing,
      tartarRemoval: formValues.tartarRemoval,
      gingivitisTreatment: formValues.gingivitisTreatment,
      orthodonticTreatment: formValues.orthodonticTreatment,
      plaqueTreatment: formValues.plaqueTreatment,
      inspectionAppointment: formValues.inspectionAppointment,
    } as ScreeningExaminationResult;
  } else {
    // TODO: Remove when fluoridation only examination is handled without form
    return {
      type: "fluoridation",
      fluorideVarnishApplied: mapOptionalValue(
        formValues.fluorideVarnishApplied,
      ),
    } as FluoridationExaminationResult;
  }
}
