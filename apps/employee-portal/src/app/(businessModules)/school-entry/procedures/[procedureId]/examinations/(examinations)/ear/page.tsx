/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { ContentPanel, ContentPanelTitle } from "@eshg/lib-employee-portal";
import {
  DisabledFormProvider,
  DynamicPageProps,
  addMissingKeys,
  dropEmptyKeys,
  useHandledMutation,
} from "@eshg/lib-portal";
import {
  ApiHertzValue,
  UpdateHearingTestResultRequest,
} from "@eshg/school-entry-api";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { HearingTestResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/HearingTestResult";
import { useUpdateHearingTestResultOptions } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import {
  getHearingTestResultQuery,
  getProcedureQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { mapExaminationResultValues } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationResultFields";
import { mapToExaminationResultFormValues } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import {
  HearingTestForm,
  HearingTestFormValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/hearingTest/HearingTestForm";

export default function SchoolEntryHearingTestPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = use(props.params);
  const schoolEntryApi = useSchoolEntryApi();
  const [{ data: procedure }, { data: hearingTestResult }] = useSuspenseQueries(
    {
      queries: [
        getProcedureQuery(schoolEntryApi, procedureId),
        getHearingTestResultQuery(schoolEntryApi, procedureId),
      ],
    },
  );
  const updateHearingTestResultOptions = useUpdateHearingTestResultOptions();
  const updateHearingTestResult = useHandledMutation(
    updateHearingTestResultOptions,
  );

  async function handleSubmit(formValues: HearingTestFormValues) {
    await updateHearingTestResult.mutateAsync(
      mapToRequest(procedureId, formValues, hearingTestResult.version),
    );
  }

  return (
    <ContentPanel>
      <ContentPanelTitle>Hörscreening</ContentPanelTitle>
      <DisabledFormProvider disabled={procedure.isClosed}>
        <HearingTestForm
          initialValues={mapToFormValues(hearingTestResult)}
          valuesToMutationBundle={(values) => ({
            mutationOptions: updateHearingTestResultOptions,
            variableSupplier: () =>
              mapToRequest(procedureId, values, hearingTestResult.version),
          })}
          onSubmit={handleSubmit}
        />
      </DisabledFormProvider>
    </ContentPanel>
  );
}

const HERTZ_VALUES = Object.values(ApiHertzValue);

function mapToFormValues(result: HearingTestResult): HearingTestFormValues {
  return {
    leftEar: addMissingKeys(result.leftEar, HERTZ_VALUES),
    rightEar: addMissingKeys(result.rightEar, HERTZ_VALUES),
    examinationResult: mapToExaminationResultFormValues(
      result.examinationResult,
    ),
    note: result.note ?? "",
  };
}

function mapToRequest(
  procedureId: string,
  formValues: HearingTestFormValues,
  version: number,
): UpdateHearingTestResultRequest {
  return {
    procedureId,
    apiHearingTestResult: {
      version,
      leftEar: dropEmptyKeys(formValues.leftEar),
      rightEar: dropEmptyKeys(formValues.rightEar),
      examinationResult: mapExaminationResultValues(
        formValues.examinationResult,
      ),
      note: formValues.note,
    },
  };
}
