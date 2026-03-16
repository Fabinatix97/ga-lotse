/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { use, useState } from "react";
import { isEmpty } from "remeda";

import { ContentPanel, ContentPanelTitle } from "@eshg/lib-employee-portal";
import {
  DisabledFormProvider,
  DynamicPageProps,
  addMissingKeys,
  dropEmptyKeys,
  mapOptionalValue,
  useHandledMutation,
} from "@eshg/lib-portal";
import {
  ApiHearingTestResult,
  ApiHertzValue,
  ApiMeasuringDeviceType,
  ApiSchoolEntryFeature,
  UpdateHearingTestResultRequest,
} from "@eshg/school-entry-api";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { HearingTestResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/HearingTestResult";
import {
  useCompleteHearingTest,
  useUpdateHearingTestResultOptions,
} from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import {
  getHearingTestResultQuery,
  getProcedureQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { mapExaminationResultValues } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationResultFields";
import { mapToExaminationResultFormValues } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/examinationResultHelpers";
import { StartMeasurementButton } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/measurements/StartMeasurementButton";
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
  const completeHearingTest = useCompleteHearingTest(procedureId);
  const [showPendingBanner, setShowPendingBanner] = useState(false);
  const isDeviceRegistryEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.MeasuringDevices,
  );

  async function handleSubmit(formValues: HearingTestFormValues) {
    await updateHearingTestResult.mutateAsync(
      mapToRequest(procedureId, formValues, hearingTestResult.version),
    );
  }

  const queryClient = useQueryClient();

  async function getTestResults() {
    const data = await completeHearingTest.mutateAsync({
      version: hearingTestResult.version,
    });
    if (data.pendingMeasurement) {
      setShowPendingBanner(true);
    } else {
      setShowPendingBanner(false);
    }
  }

  function stopAwaitingResult() {
    setShowPendingBanner(false);
    queryClient.setQueryData<ApiHearingTestResult>(
      schoolEntryApiQueryKey(["getHearingTestResult", procedureId]),
      (old) => {
        if (!old) return;
        return {
          ...old,
          pendingMeasurement: undefined,
        };
      },
    );
  }

  return (
    <ContentPanel>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <ContentPanelTitle>Hörscreening</ContentPanelTitle>
        {isDeviceRegistryEnabled && !hearingTestResult.pendingMeasurement && (
          <StartMeasurementButton
            deviceType={ApiMeasuringDeviceType.HearingTest}
            hasTestResults={
              !isEmpty(hearingTestResult.leftEar) ||
              !isEmpty(hearingTestResult.rightEar)
            }
            procedureId={procedureId}
            version={hearingTestResult.version}
          />
        )}
      </Stack>
      <DisabledFormProvider disabled={procedure.isClosed}>
        <HearingTestForm
          initialValues={mapToFormValues(hearingTestResult)}
          valuesToMutationBundle={(values) => ({
            mutationOptions: updateHearingTestResultOptions,
            variableSupplier: () =>
              mapToRequest(procedureId, values, hearingTestResult.version),
          })}
          pendingMeasurement={hearingTestResult.pendingMeasurement}
          procedureId={procedureId}
          showPendingBanner={showPendingBanner}
          isDeviceRegistryEnabled={isDeviceRegistryEnabled}
          getTestResults={getTestResults}
          stopAwaitingResult={stopAwaitingResult}
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
      note: mapOptionalValue(formValues.note),
    },
  };
}
