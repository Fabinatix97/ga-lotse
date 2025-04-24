/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckboxField } from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import {
  ApiRapidTestExamination,
  ApiTextTemplateContext,
} from "@eshg/sti-protection-api";
import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  useUpsertRapidTestOptions,
  useUpsertRapidTests,
} from "@/lib/businessModules/stiProtection/api/mutations/examination";
import { TextareaFieldWithTextTemplates } from "@/lib/businessModules/stiProtection/components/textTemplates/TextareaFieldWithTextTemplates";
import {
  SidecarContainer,
  SidecarFormLayout,
} from "@/lib/businessModules/stiProtection/features/procedures/SidecarFormLayout";
import { TabStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/TabStickyBottomButtonBar";
import { ExaminationTabNavPanel } from "@/lib/businessModules/stiProtection/features/procedures/examination/ExaminationTabNavPanel";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

import {
  RapidTestWithBooleanResult,
  RapidTestWithTextResult,
  RapidTestWithUnitStringResult,
} from "./RapidTestTemplates";
import {
  RapidTestExaminationData,
  defaultRapidTestExaminationFormValues,
  mapFormValuesToApi,
  mapToFormValues,
} from "./helpers";

interface RapidTestExaminationProps {
  procedureId: string;
  rapidTestExamination: ApiRapidTestExamination;
}

export function RapidTestExamination(props: RapidTestExaminationProps) {
  const { procedureId, rapidTestExamination: rapidTests } = props;
  const upsertRapidTestOptions = useUpsertRapidTestOptions({ procedureId });
  const upsertRapidTests = useUpsertRapidTests({ procedureId });

  function onSubmit(values: RapidTestExaminationData) {
    return upsertRapidTests.mutateAsync({
      rapidTests: mapFormValuesToApi(values),
    });
  }

  return (
    <Formik
      initialValues={
        rapidTests
          ? mapToFormValues(rapidTests)
          : defaultRapidTestExaminationFormValues()
      }
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values }) => (
        <FormPlus sx={{ height: "100%" }}>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: upsertRapidTestOptions,
              variableSupplier: () => ({
                procedureId,
                rapidTests: mapFormValuesToApi(values),
              }),
            }}
          />
          <SidecarFormLayout>
            <Sheet sx={{ padding: 3 }}>
              <Stack gap={3}>
                <Typography level="h2">Schnelltests</Typography>

                <Stack gap={3}>
                  <RapidTestWithBooleanResult
                    name="hivTestRequested"
                    label="HIV-Schnelltest"
                    number="hivTestData.number"
                    result="hivTestData.result"
                    positiveFieldLabel="Reaktiv"
                  />
                  <Divider />
                  <RapidTestWithBooleanResult
                    name="syphilisTestRequested"
                    label="Syphilis-Schnelltest"
                    number="syphilisTestData.number"
                    result="syphilisTestData.result"
                    positiveFieldLabel="Reaktiv"
                  />
                  <Divider />
                  <RapidTestWithTextResult
                    name="ultrasoundTestRequested"
                    label="Ultraschall"
                    result="ultrasoundTestResult"
                  />
                  <Divider />
                  <RapidTestWithBooleanResult
                    name="pregnancyTestRequested"
                    label="Schwangerschaftstest"
                    number="pregnancyTestData.number"
                    result="pregnancyTestData.result"
                  />
                  <Divider />
                  <RapidTestWithUnitStringResult
                    name="bloodPressureTestRequested"
                    label="Blutdruck"
                    result="bloodPressureTestResult"
                    unitText="Angabe in mmHg"
                  />
                  <Divider />
                  <RapidTestWithUnitStringResult
                    name="pulseTestRequested"
                    label="Puls"
                    result="pulseTestResult"
                    unitText="Angabe in bpm"
                  />
                  <Divider />
                  <RapidTestWithTextResult
                    name="urineTestRequested"
                    label="Urinuntersuchung"
                    result="urineTestResult"
                  />
                </Stack>
              </Stack>
            </Sheet>
            <SidecarContainer>
              <ExaminationTabNavPanel id={procedureId} />
              <ExaminationTabInfo />
            </SidecarContainer>
          </SidecarFormLayout>
          <TabStickyBottomButtonBar />
        </FormPlus>
      )}
    </Formik>
  );
}

function ExaminationTabInfo() {
  return (
    <Sheet>
      <Typography level={"h3"} mb={3}>
        Schnelltests
      </Typography>
      <Stack
        component="section"
        gap={3}
        aria-label={"Weitere Angaben zu den Schnelltests"}
      >
        <TextareaFieldWithTextTemplates
          name="generalRemarks"
          label="Allgemeine Bemerkungen"
          minRows={5}
          context={ApiTextTemplateContext.RapidTestsRemark}
        />
        <CheckboxField name="testsPayed" label="Tests bezahlt" />
      </Stack>
    </Sheet>
  );
}
