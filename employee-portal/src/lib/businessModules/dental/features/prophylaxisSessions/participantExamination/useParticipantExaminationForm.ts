/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
  isEmptyExaminationResult,
} from "@eshg/dental/api/models/ExaminationResult";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { useFormik } from "formik";

import {
  ExaminationFormValues,
  mapToExaminationFormValues,
} from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
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

  return useFormik({
    initialValues: mapToExaminationFormValues(
      initialValues.result,
      initialValues.note,
    ),
    onSubmit: (formValues: ExaminationFormValues) => {
      onSubmit(mapToExaminationValues(isScreening, formValues));
    },
    enableReinitialize: true,
  });
}

function mapToExaminationValues(
  screening: boolean,
  formValues: ExaminationFormValues,
): ExaminationOutputValues {
  return {
    result: mapToExaminationResult(screening, formValues),
    note: mapOptionalValue(formValues.note),
  };
}

function mapToExaminationResult(
  screening: boolean,
  formValues: ExaminationFormValues,
): ExaminationResult | undefined {
  let result: FluoridationExaminationResult | ScreeningExaminationResult;
  if (screening) {
    result = {
      type: "screening",
      oralHygieneStatus: mapOptionalValue(formValues.oralHygieneStatus),
      fluorideVarnishApplied: mapOptionalValue(
        formValues.fluorideVarnishApplied,
      ),
      toothDiagnoses: {},
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
