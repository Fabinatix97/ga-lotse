/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
  ToothDiagnosis,
} from "@eshg/dental";
import { ApiDentitionType, ApiTooth } from "@eshg/dental-api";
import { useAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { useFormik } from "formik";

import {
  ExaminationFormValues,
  mapToExaminationFormValues,
} from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { INVALID_EXAMINATION_RESULT_VALIDATION_ERROR } from "@/lib/businessModules/dental/features/examinations/translations";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

interface ExaminationInputValues {
  result?: ExaminationResult;
  note?: string;
  prophylaxisDentitionType?: ApiDentitionType;
}

interface ExaminationOutputValues {
  result?: ExaminationResult;
  note?: string;
}

interface UseParticipantExaminationFormParams {
  initialValues: ExaminationInputValues;
  onSubmit: (values: ExaminationOutputValues) => void;
}

export function useParticipantExaminationForm(
  params: UseParticipantExaminationFormParams,
) {
  const { initialValues, onSubmit } = params;

  const isScreening = useProphylaxisSessionStore((state) => state.isScreening);
  const isDentalExaminationDirty = useDentalExaminationStore(
    (state) => state.dirty,
  );
  const submitDentalExamination = useDentalExaminationStore(
    (state) => state.submit,
  );
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
