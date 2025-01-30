/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationResult } from "@eshg/dental/api/models/ExaminationResult";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";
import { useFormik } from "formik";

import {
  ExaminationFormValues,
  mapToExaminationFormValues,
} from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/store/ProphylaxisSessionStoreProvider";

interface UseProphylaxisSessionExaminationFormParams {
  examinationResult: ExaminationResult | undefined;
  note: string | undefined;
  onSubmit: (examinationResult: ExaminationResult) => void;
}

export function useProphylaxisSessionExaminationForm(
  params: UseProphylaxisSessionExaminationFormParams,
) {
  const { examinationResult, note, onSubmit } = params;

  const isScreening = useProphylaxisSessionStore((state) => state.isScreening);

  const examinationForm = useFormik({
    initialValues: mapToExaminationFormValues(
      examinationResult,
      note, // TODO pass actual note
    ),
    onSubmit: (formValues: ExaminationFormValues) => {
      onSubmit(mapToExaminationResult(isScreening, formValues));
    },
    enableReinitialize: true,
  });

  return examinationForm;
}

function mapToExaminationResult(
  screening: boolean,
  formValues: ExaminationFormValues,
): ExaminationResult {
  if (screening) {
    return {
      type: "screening",
      oralHygieneStatus: mapOptionalValue(formValues.oralHygieneStatus),
      fluorideVarnishApplied:
        mapOptionalValue(formValues.fluorideVarnishApplied) ?? false,
    };
  }

  // TODO: Remove when fluoridation only examination is handled without form
  return {
    type: "fluoridation",
    fluorideVarnishApplied: mapRequiredValue(formValues.fluorideVarnishApplied),
  };
}
