/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiRapidTestExamination } from "@eshg/employee-portal-api/stiProtection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Box, Divider, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { Formik, FormikState } from "formik";

import { useUpsertRapidTest } from "@/lib/businessModules/stiProtection/api/mutations/examination";
import { ExaminationStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/examination/ExaminationStickyBottomButtonBar";
import { ExaminationTabNavPanel } from "@/lib/businessModules/stiProtection/features/procedures/examination/ExaminationTabNavPanel";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { SidePanel } from "@/lib/shared/components/sidePanel/SidePanel";
import { SidePanelTitle } from "@/lib/shared/components/sidePanel/SidePanelTitle";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import {
  RapidTestData,
  RapidTestWithBooleanResult,
  RapidTestWithTextResult,
  RapidTestWithUnitStringResult,
  mapRapidTestToApi,
  mapRapidTestToForm,
} from "./RapidTestTemplates";

export interface RapidTestExaminationData {
  hivTestRequested: boolean;
  hivTestData: RapidTestData | null;
  syphilisTestRequested: boolean;
  syphilisTestData: RapidTestData | null;
  ultrasoundTestRequested: boolean;
  ultrasoundTestResult: string;
  pregnancyTestRequested: boolean;
  pregnancyTestData: RapidTestData | null;
  bloodPressureTestRequested: boolean;
  bloodPressureTestResult: string;
  pulseTestRequested: boolean;
  pulseTestResult: string;
  urineTestRequested: boolean;
  urineTestResult: string;
  generalRemarks: string;
  testsPayed: boolean;
}

function mapToFormValues(
  responseData: ApiRapidTestExamination,
): RapidTestExaminationData {
  return {
    hivTestRequested: responseData.hivRequested,
    hivTestData: mapRapidTestToForm(responseData.hivData),
    syphilisTestRequested: responseData.syphilisRequested,
    syphilisTestData: mapRapidTestToForm(responseData.syphilisData),
    ultrasoundTestRequested: responseData.ultrasoundRequested,
    ultrasoundTestResult: responseData.ultrasoundData ?? "",
    pregnancyTestRequested: responseData.pregnancyTestRequested,
    pregnancyTestData: mapRapidTestToForm(responseData.pregnancyTestData),
    bloodPressureTestRequested: responseData.bloodPressureRequested,
    bloodPressureTestResult: responseData.bloodPressureData ?? "",
    pulseTestRequested: responseData.pulseRequested,
    pulseTestResult: responseData.pulseData ?? "",
    urineTestRequested: responseData.urinalysisRequested,
    urineTestResult: responseData.urinalysisData ?? "",
    generalRemarks: responseData.generalComments ?? "",
    testsPayed: responseData.testsPayed,
  };
}

function defaultRapidTestExaminationFormValues(): RapidTestExaminationData {
  return {
    hivTestRequested: false,
    hivTestData: mapRapidTestToForm(),
    syphilisTestRequested: false,
    syphilisTestData: mapRapidTestToForm(),
    ultrasoundTestRequested: false,
    ultrasoundTestResult: "",
    pregnancyTestRequested: false,
    pregnancyTestData: mapRapidTestToForm(),
    bloodPressureTestRequested: false,
    bloodPressureTestResult: "",
    pulseTestRequested: false,
    pulseTestResult: "",
    urineTestRequested: false,
    urineTestResult: "",
    generalRemarks: "",
    testsPayed: false,
  };
}

function mapFormValuesToApi(
  values: RapidTestExaminationData,
): ApiRapidTestExamination {
  return {
    generalComments: values.generalRemarks ?? undefined,
    testsPayed: values.testsPayed,
    hivRequested: values.hivTestRequested,
    syphilisRequested: values.syphilisTestRequested,
    pregnancyTestRequested: values.pregnancyTestRequested,
    ultrasoundRequested: values.ultrasoundTestRequested,
    bloodPressureRequested: values.bloodPressureTestRequested,
    pulseRequested: values.pulseTestRequested,
    urinalysisRequested: values.urineTestRequested,
    hivData: values.hivTestRequested
      ? mapRapidTestToApi(values.hivTestData)
      : undefined,
    syphilisData: values.syphilisTestRequested
      ? mapRapidTestToApi(values.syphilisTestData)
      : undefined,
    pregnancyTestData: values.pregnancyTestRequested
      ? mapRapidTestToApi(values.pregnancyTestData)
      : undefined,
    ultrasoundData: values.ultrasoundTestRequested
      ? values.ultrasoundTestResult
      : undefined,
    bloodPressureData: values.bloodPressureTestRequested
      ? values.bloodPressureTestResult
      : undefined,
    pulseData: values.pulseTestRequested ? values.pulseTestResult : undefined,
    urinalysisData: values.urineTestRequested
      ? values.urineTestResult
      : undefined,
  };
}

interface RapidTestExaminationProps {
  procedureId: string;
  rapidTestExamination: ApiRapidTestExamination;
}

export function RapidTestExamination(props: RapidTestExaminationProps) {
  const { procedureId, rapidTestExamination: rapidTests } = props;
  const upsertRapidTests = useUpsertRapidTest(procedureId);

  function onSubmit(values: RapidTestExaminationData) {
    return upsertRapidTests.mutateAsync({
      rapidTests: mapFormValuesToApi(values),
    });
  }

  const { openCancelDialog } = useConfirmationDialog();

  function onCancel(
    dirty: boolean,
    reset: (state?: Partial<FormikState<RapidTestExaminationData>>) => void,
  ) {
    if (!dirty) {
      return;
    }
    openCancelDialog({
      onConfirm: () => {
        reset();
      },
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
      {({ dirty, resetForm, isSubmitting }) => (
        <FormPlus sx={{ height: "100%", overflow: "hidden" }}>
          <Box
            sx={{
              pt: 3,
              pr: 3,
              pb: 15,
              pl: 3,
              height: "100%",
              overflow: "auto",
            }}
          >
            <Grid container spacing={2}>
              <Grid container spacing={2} xs={12} lg={9}>
                <Grid xs={12}>
                  <Sheet>
                    <Stack gap={3}>
                      <Typography level="h2">{"Schnelltests"}</Typography>
                      <Stack gap={3}>
                        <RapidTestWithBooleanResult
                          name={"hivTestRequested"}
                          label={"HIV-Schnelltest"}
                          number={"hivTestData.number"}
                          result={"hivTestData.result"}
                          positiveFieldLabel="Reaktiv"
                        />
                        <Divider />
                        <RapidTestWithBooleanResult
                          name={"syphilisTestRequested"}
                          label={"Syphilis-Schnelltest"}
                          number={"syphilisTestData.number"}
                          result={"syphilisTestData.result"}
                          positiveFieldLabel="Reaktiv"
                        />
                        <Divider />
                        <RapidTestWithTextResult
                          name={"ultrasoundTestRequested"}
                          label={"Ultraschall"}
                          result={"ultrasoundTestResult"}
                        />
                        <Divider />
                        <RapidTestWithBooleanResult
                          name={"pregnancyTestRequested"}
                          label={"Schwangerschaftstest"}
                          number={"pregnancyTestData.number"}
                          result={"pregnancyTestData.result"}
                        />
                        <Divider />
                        <RapidTestWithUnitStringResult
                          name={"bloodPressureTestRequested"}
                          label={"Blutdruck"}
                          result={"bloodPressureTestResult"}
                          unitText={"Angabe in mmHg"}
                        />
                        <Divider />
                        <RapidTestWithUnitStringResult
                          name={"pulseTestRequested"}
                          label={"Puls"}
                          result={"pulseTestResult"}
                          unitText={"Angabe in bpm"}
                        />
                        <Divider />
                        <RapidTestWithTextResult
                          name={"urineTestRequested"}
                          label={"Urinuntersuchung"}
                          result={"urineTestResult"}
                        />
                      </Stack>
                    </Stack>
                  </Sheet>
                </Grid>
              </Grid>
              <Grid xs={12} lg={3}>
                <Stack spacing={2}>
                  <ExaminationTabNavPanel id={procedureId} />
                  <ExaminationTabInfo />
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <ExaminationStickyBottomButtonBar
            isSubmitting={isSubmitting}
            onClick={() => onCancel(dirty, resetForm)}
          />
        </FormPlus>
      )}
    </Formik>
  );
}

function ExaminationTabInfo() {
  return (
    <SidePanel>
      <SidePanelTitle component={"h3"} fontSize={"1.25rem"}>
        Schnelltests
      </SidePanelTitle>
      <Stack
        component="section"
        gap={3}
        aria-label={"Weitere Angaben zu den Schnelltests"}
      >
        <Stack paddingTop={1}>
          <Typography>Allgemeine Bemerkung</Typography>
          <TextareaField name="generalRemarks" minRows={4} />
        </Stack>
        <CheckboxField name="testsPayed" label={"Tests bezahlt"} />
      </Stack>
    </SidePanel>
  );
}
