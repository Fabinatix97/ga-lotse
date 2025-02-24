/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDentitionType, ApiTooth } from "@eshg/dental-api";
import {
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
  isEmptyExaminationResult,
} from "@eshg/dental/api/models/ExaminationResult";
import { ToothDiagnosis } from "@eshg/dental/api/models/ToothDiagnosis";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { useFormik } from "formik";

import {
  ExaminationFormValues,
  mapToExaminationFormValues,
} from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";

interface ExaminationInputValues {
  result?: ExaminationResult;
  note?: string;
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
  const getToothDiagnoses = useDentalExaminationStore(
    (state) => state.getToothDiagnoses,
  );

  return useFormik({
    initialValues: mapToExaminationFormValues(
      initialValues.result,
      initialValues.note,
    ),
    onSubmit: (formValues: ExaminationFormValues) => {
      onSubmit(
        mapToExaminationValues(isScreening, formValues, getToothDiagnoses()),
      );
    },
    enableReinitialize: true,
  });
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
  let result: FluoridationExaminationResult | ScreeningExaminationResult;
  if (screening) {
    result = {
      type: "screening",
      oralHygieneStatus: mapOptionalValue(formValues.oralHygieneStatus),
      fluorideVarnishApplied: mapOptionalValue(
        formValues.fluorideVarnishApplied,
      ),
      dentitionType: ApiDentitionType.Mixed,
      toothDiagnoses: toothDiagnoses,
    };
  } else {
    // TODO: Remove when fluoridation only examination is handled without form
    result = {
      type: "fluoridation",
      fluorideVarnishApplied: mapOptionalValue(
        formValues.fluorideVarnishApplied,
      ),
    };
  }

  if (isEmptyExaminationResult(result)) {
    return undefined;
  }
  return result;
}
