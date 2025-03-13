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
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
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
  const getToothDiagnoses = useDentalExaminationStore(
    (state) => state.getToothDiagnoses,
  );

  return useFormik({
    initialValues: mapToExaminationFormValues(
      initialValues.result,
      initialValues.note,
      initialValues.prophylaxisDentitionType,
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
