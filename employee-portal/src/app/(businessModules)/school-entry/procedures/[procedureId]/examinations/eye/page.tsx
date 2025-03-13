/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { addMissingKeys, dropEmptyKeys } from "@eshg/lib-portal/helpers/form";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import {
  ApiEyeExaminationType,
  UpdateEyeExaminationResultRequest,
} from "@eshg/school-entry-api";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { EyeExaminationResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/EyeExaminationResult";
import { useUpdateEyeExaminationResultOptions } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import {
  getEyeExaminationResultQuery,
  getProcedureQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { mapExaminationResultValues } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationResultFields";
import { mapToExaminationResultFormValues } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import {
  EyeExaminationForm,
  EyeExaminationFormValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/eyeExamination/EyeExaminationForm";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { ContentPanelTitle } from "@/lib/shared/components/contentPanel/ContentPanelTitle";

export default function SchoolEntryEyeExaminationPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = props.params;
  const schoolEntryApi = useSchoolEntryApi();
  const [{ data: procedure }, { data: eyeExaminationResult }] =
    useSuspenseQueries({
      queries: [
        getProcedureQuery(schoolEntryApi, procedureId),
        getEyeExaminationResultQuery(schoolEntryApi, procedureId),
      ],
    });
  const updateEyeExaminationResultOptions =
    useUpdateEyeExaminationResultOptions();
  const updateEyeExaminationResult = useHandledMutation(
    updateEyeExaminationResultOptions,
  );

  async function handleSubmit(formValues: EyeExaminationFormValues) {
    await updateEyeExaminationResult.mutateAsync(
      mapToRequest(procedureId, formValues, eyeExaminationResult.version),
    );
  }

  return (
    <ContentPanel>
      <ContentPanelTitle>Sehscreening</ContentPanelTitle>
      <DisabledFormProvider disabled={procedure.isClosed}>
        <EyeExaminationForm
          initialValues={mapToFormValues(eyeExaminationResult)}
          onSubmit={handleSubmit}
          valuesToMutationBundle={(values) => ({
            mutationOptions: updateEyeExaminationResultOptions,
            variableSupplier: () =>
              mapToRequest(procedureId, values, eyeExaminationResult.version),
          })}
        />
      </DisabledFormProvider>
    </ContentPanel>
  );
}

const EYE_EXAMINATION_TYPES = Object.values(ApiEyeExaminationType);

function mapToFormValues(
  eyeExaminationResult: EyeExaminationResult,
): EyeExaminationFormValues {
  return {
    leftEye: addMissingKeys(
      eyeExaminationResult.leftEye,
      EYE_EXAMINATION_TYPES,
    ),
    rightEye: addMissingKeys(
      eyeExaminationResult.rightEye,
      EYE_EXAMINATION_TYPES,
    ),
    eyeExamination: mapToExaminationResultFormValues(
      eyeExaminationResult.eyeExamination,
    ),
    ishiharaExamination: mapToExaminationResultFormValues(
      eyeExaminationResult.ishiharaExamination,
    ),
    langExamination: mapToExaminationResultFormValues(
      eyeExaminationResult.langExamination,
    ),
    amblyopia: eyeExaminationResult.amblyopia,
    astigmatism: eyeExaminationResult.astigmatism,
    colorVisionDisorder: eyeExaminationResult.colorVisionDisorder,
    hyperopia: eyeExaminationResult.hyperopia,
    myopia: eyeExaminationResult.myopia,
    otherDiagnosis: eyeExaminationResult.otherDiagnosis,
    strabismus: eyeExaminationResult.strabismus,
    note: eyeExaminationResult.note ?? "",
  };
}

function mapToRequest(
  procedureId: string,
  formValues: EyeExaminationFormValues,
  version: number,
): UpdateEyeExaminationResultRequest {
  return {
    procedureId,
    apiEyeExaminationResult: {
      version,
      leftEye: dropEmptyKeys(formValues.leftEye),
      rightEye: dropEmptyKeys(formValues.rightEye),
      eyeExamination: mapExaminationResultValues(formValues.eyeExamination),
      ishiharaExamination: mapExaminationResultValues(
        formValues.ishiharaExamination,
      ),
      langExamination: mapExaminationResultValues(formValues.langExamination),
      amblyopia: formValues.amblyopia,
      astigmatism: formValues.astigmatism,
      colorVisionDisorder: formValues.colorVisionDisorder,
      hyperopia: formValues.hyperopia,
      myopia: formValues.myopia,
      otherDiagnosis: formValues.otherDiagnosis,
      strabismus: formValues.strabismus,
      note: formValues.note,
    },
  };
}
