/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { useFormik } from "formik";

import {
  ApiExaminationResult,
  UpdateExaminationRequest,
} from "@eshg/dental-api";
import { useConfirmLeaveDirtyFormEffect } from "@eshg/lib-employee-portal";
import { mapOptionalValue, mapRequiredValue, useAlert } from "@eshg/lib-portal";

import {
  ScreeningExaminationResult,
  ScreeningExaminationResultWithDate,
  ToothDiagnoses,
} from "../../../../api/models/ExaminationResult";
import { ExaminationFormLayout } from "../../../../components/examination/ExaminationFormLayout";
import { useDentalApi } from "../../../../contexts/dental";
import { useExaminationStore } from "../../../../stores/examination/ExaminationStoreProvider";
import { INVALID_EXAMINATION_RESULT_VALIDATION_ERROR } from "../../../../translations/examination";
import { ExaminationFormValues } from "../../../../types/examination";
import {
  mapToExaminationFormValues,
  mapToothDiagnosesToRequest,
} from "../../../../utils/examination";
import { ChildExamination } from "../../api/models/ChildExamination";
import { useUpdateExamination } from "../../api/mutations/details";
import {
  getChildDetailsQuery,
  getExaminationQuery,
} from "../../api/queries/details";

import { ChildExaminationForm } from "./ChildExaminationForm";

interface ChildExaminationFormLayout {
  childId: string;
  examinationId: string;
}

export function ChildExaminationFormLayout(props: ChildExaminationFormLayout) {
  const { childId, examinationId } = props;
  const { childApi } = useDentalApi();
  const [{ data: examination }, { data: child }] = useSuspenseQueries({
    queries: [
      getExaminationQuery(childApi, examinationId),
      getChildDetailsQuery(childApi, childId),
    ],
  });
  const institutionAtExaminationDate = child.institutions.find(
    (institution) => institution.year === examination.dateAndTime.getFullYear(),
  );

  const allScreeningExaminations = mapPreviousScreeningExaminations(
    child.examinations,
  );

  const submitExamination = useExaminationStore((state) => state.submit);
  const isExaminationDirty = useExaminationStore((state) => state.dirty);
  const updateExamination = useUpdateExamination(examination.id);
  const alert = useAlert();
  const examinationForm = useFormik({
    initialValues: mapToExaminationFormValues(
      examination.result,
      examination.note,
      examination.prophylaxisDentitionType,
    ),
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const isDirty = examinationForm.dirty || isExaminationDirty;
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
    <ChildExaminationForm form={examinationForm}>
      <ExaminationFormLayout
        isScreening={examination.screening}
        isFluoridation={examination.fluoridation}
        isFluoridationConsentGiven={examination.fluoridationConsentGiven}
        dateAndTime={examination.dateAndTime}
        institution={institutionAtExaminationDate?.institution}
        groupName={institutionAtExaminationDate?.groupName}
        child={child}
        previousExaminations={allScreeningExaminations}
      />
    </ChildExaminationForm>
  );
}

function mapPreviousScreeningExaminations(
  response: ChildExamination[],
): ScreeningExaminationResultWithDate[] {
  return response
    .filter((e) => e.result?.type === "screening" && e.result !== null)
    .map((examination) => ({
      result: examination.result as ScreeningExaminationResult,
      dateAndTime: examination.dateAndTime,
    }));
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
      blackStain: formValues.blackStain,
      toothDiagnoses: mapToothDiagnosesToRequest(toothDiagnoses),
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
