/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLaboratoryTestExamination } from "@eshg/employee-portal-api/stiProtection";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Box, Divider, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { Formik, FormikState } from "formik";

import { useUpsertLaboratoryTest } from "@/lib/businessModules/stiProtection/api/mutations/examination";
import { ExaminationStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/examination/ExaminationStickyBottomButtonBar";
import { ExaminationTabNavPanel } from "@/lib/businessModules/stiProtection/features/procedures/examination/ExaminationTabNavPanel";
import {
  guardValue,
  mapOptionalString,
} from "@/lib/businessModules/stiProtection/shared/helpers";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { SidePanel } from "@/lib/shared/components/sidePanel/SidePanel";
import { SidePanelTitle } from "@/lib/shared/components/sidePanel/SidePanelTitle";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import {
  HepatitisLaboratoryTest,
  HepatitisLaboratoryTestData,
  LaboratoryTestData,
  LaboratoryTestSamples,
  LaboratoryTestSamplesData,
  LaboratoryTestWithBooleanResult,
  defaultHepatitisLaboratoryTestFormData,
  defaultLaboratoryTestFormData,
  defaultLaboratoryTestSamplesFormData,
  mapApiHepatitisLaboratoryTestToFormData,
  mapApiLaboratoryTestSamplesToFormData,
  mapApiLaboratoryTestToFormData,
  mapHepatitisLaboratoryTestFormDataToApi,
  mapLaboratoryTestFormDataToApi,
  mapLaboratoryTestSamplesFormDataToApi,
} from "./LaboratoryTestTemplates";

export interface LaboratoryTestExaminationData {
  sampleBarcode?: string;
  generalRemarks?: string;
  testsConducted?: boolean;
  testsPayed?: boolean;
  //Requested Tests
  hivTestRequested?: boolean;
  syphilisTestRequested?: boolean;
  hepATestRequested?: boolean;
  hepBTestRequested?: boolean;
  hepCTestRequested?: boolean;
  chlamydiaTestRequested?: boolean;
  gonorrheaTestRequested?: boolean;
  mycoplasmaTestRequested?: boolean;
  cancerScreeningTestRequested?: boolean;
  hpvTestRequested?: boolean;
  mpoxTestRequested?: boolean;
  otherTestRequested?: boolean;
  //Data of Tests
  hivTestData: LaboratoryTestData | null;
  syphilisTestData: LaboratoryTestData | null;
  hadSyphilis?: boolean;
  hepATestData: HepatitisLaboratoryTestData | null;
  hepBTestData: HepatitisLaboratoryTestData | null;
  hepCTestData: LaboratoryTestData | null;
  chlamydiaTestData: LaboratoryTestSamplesData | null;
  gonorrheaTestData: LaboratoryTestSamplesData | null;
  mycoplasmaTestData: LaboratoryTestSamplesData | null;
  cancerScreeningTestData: LaboratoryTestData | null;
  hpvTestData: LaboratoryTestData | null;
  mpoxTestData: LaboratoryTestData | null;
  otherTestName?: string;
  otherTestData: LaboratoryTestData | null;
}

function mapToFormValues(
  responseData: ApiLaboratoryTestExamination,
): LaboratoryTestExaminationData {
  return {
    sampleBarcode: responseData.sampleBarcode ?? "",
    generalRemarks: responseData.generalRemarks ?? "",
    testsConducted: responseData.testsConducted ?? false,
    testsPayed: responseData.testsPayed ?? false,
    //Requested Tests
    hivTestRequested: responseData.hivTestRequested ?? false,
    syphilisTestRequested: responseData.syphilisTestRequested ?? false,
    hepATestRequested: responseData.hepATestRequested ?? false,
    hepBTestRequested: responseData.hepBTestRequested ?? false,
    hepCTestRequested: responseData.hepCTestRequested ?? false,
    chlamydiaTestRequested: responseData.chlamydiaTestRequested ?? false,
    gonorrheaTestRequested: responseData.gonorrheaTestRequested ?? false,
    mycoplasmaTestRequested: responseData.mycoplasmaTestRequested ?? false,
    cancerScreeningTestRequested:
      responseData.cancerScreeningTestRequested ?? false,
    hpvTestRequested: responseData.hpvTestRequested ?? false,
    mpoxTestRequested: responseData.mpoxTestRequested ?? false,
    otherTestRequested: responseData.otherTestRequested ?? false,
    //Data of Tests
    hivTestData: mapApiLaboratoryTestToFormData(responseData.hivTestData),
    syphilisTestData: mapApiLaboratoryTestToFormData(
      responseData.syphilisTestData,
    ),
    hadSyphilis: responseData.hadSyphilis ?? false,
    hepATestData: mapApiHepatitisLaboratoryTestToFormData(
      responseData.hepATestData,
    ),
    hepBTestData: mapApiHepatitisLaboratoryTestToFormData(
      responseData.hepBTestData,
    ),
    hepCTestData: mapApiLaboratoryTestToFormData(responseData.hepCTestData),
    chlamydiaTestData: mapApiLaboratoryTestSamplesToFormData(
      responseData.chlamydiaTestSamples,
    ),
    gonorrheaTestData: mapApiLaboratoryTestSamplesToFormData(
      responseData.gonorrheaTestSamples,
    ),
    mycoplasmaTestData: mapApiLaboratoryTestSamplesToFormData(
      responseData.mycoplasmaTestSamples,
    ),
    cancerScreeningTestData: mapApiLaboratoryTestToFormData(
      responseData.cancerScreeningTestData,
    ),
    hpvTestData: mapApiLaboratoryTestToFormData(responseData.hpvTestData),
    mpoxTestData: mapApiLaboratoryTestToFormData(responseData.mpoxTestData),
    otherTestName: responseData.otherTestRequested
      ? (responseData.otherTestName ?? "")
      : "",
    otherTestData: mapApiLaboratoryTestToFormData(responseData.otherTestData),
  };
}

function defaultLaboratoryTestExaminationFormValues(): LaboratoryTestExaminationData {
  return {
    sampleBarcode: "",
    generalRemarks: "",
    testsConducted: false,
    testsPayed: false,
    //Requested Tests
    hivTestRequested: false,
    syphilisTestRequested: false,
    hepATestRequested: false,
    hepBTestRequested: false,
    hepCTestRequested: false,
    chlamydiaTestRequested: false,
    gonorrheaTestRequested: false,
    mycoplasmaTestRequested: false,
    cancerScreeningTestRequested: false,
    hpvTestRequested: false,
    mpoxTestRequested: false,
    otherTestRequested: false,
    //Data of Tests
    hivTestData: defaultLaboratoryTestFormData,
    syphilisTestData: defaultLaboratoryTestFormData,
    hadSyphilis: false,
    hepATestData: defaultHepatitisLaboratoryTestFormData,
    hepBTestData: defaultHepatitisLaboratoryTestFormData,
    hepCTestData: defaultLaboratoryTestFormData,
    chlamydiaTestData: defaultLaboratoryTestSamplesFormData,
    gonorrheaTestData: defaultLaboratoryTestSamplesFormData,
    mycoplasmaTestData: defaultLaboratoryTestSamplesFormData,
    cancerScreeningTestData: defaultLaboratoryTestFormData,
    hpvTestData: defaultLaboratoryTestFormData,
    mpoxTestData: defaultLaboratoryTestFormData,
    otherTestName: "",
    otherTestData: defaultLaboratoryTestFormData,
  };
}

function mapFormValuesToApi(
  formData: LaboratoryTestExaminationData,
): ApiLaboratoryTestExamination {
  return {
    sampleBarcode: mapOptionalString(formData.sampleBarcode),
    generalRemarks: mapOptionalString(formData.generalRemarks),
    testsConducted: formData.testsConducted ?? false,
    testsPayed: formData.testsPayed ?? false,
    //Requested Tests
    hivTestRequested: formData.hivTestRequested ?? false,
    syphilisTestRequested: formData.syphilisTestRequested ?? false,
    hepATestRequested: formData.hepATestRequested ?? false,
    hepBTestRequested: formData.hepBTestRequested ?? false,
    hepCTestRequested: formData.hepCTestRequested ?? false,
    chlamydiaTestRequested: formData.chlamydiaTestRequested ?? false,
    gonorrheaTestRequested: formData.gonorrheaTestRequested ?? false,
    mycoplasmaTestRequested: formData.mycoplasmaTestRequested ?? false,
    cancerScreeningTestRequested:
      formData.cancerScreeningTestRequested ?? false,
    hpvTestRequested: formData.hpvTestRequested ?? false,
    mpoxTestRequested: formData.mpoxTestRequested ?? false,
    otherTestRequested: formData.otherTestRequested ?? false,
    //Data of Tests
    hivTestData: guardValue(
      formData.hivTestRequested,
      mapLaboratoryTestFormDataToApi(formData.hivTestData),
    ),
    syphilisTestData: guardValue(
      formData.syphilisTestRequested,
      mapLaboratoryTestFormDataToApi(formData.syphilisTestData),
    ),
    hadSyphilis: guardValue(
      formData.syphilisTestRequested,
      formData.hadSyphilis,
    ),
    hepATestData: guardValue(
      formData.hepATestRequested,
      mapHepatitisLaboratoryTestFormDataToApi(formData.hepATestData),
    ),
    hepBTestData: guardValue(
      formData.hepBTestRequested,
      mapHepatitisLaboratoryTestFormDataToApi(formData.hepBTestData),
    ),
    hepCTestData: guardValue(
      formData.hepCTestRequested,
      mapLaboratoryTestFormDataToApi(formData.hepCTestData),
    ),
    chlamydiaTestSamples: guardValue(
      formData.chlamydiaTestRequested,
      mapLaboratoryTestSamplesFormDataToApi(formData.chlamydiaTestData),
    ),
    gonorrheaTestSamples: guardValue(
      formData.gonorrheaTestRequested,
      mapLaboratoryTestSamplesFormDataToApi(formData.gonorrheaTestData),
    ),
    mycoplasmaTestSamples: guardValue(
      formData.mycoplasmaTestRequested,
      mapLaboratoryTestSamplesFormDataToApi(formData.mycoplasmaTestData),
    ),
    cancerScreeningTestData: guardValue(
      formData.cancerScreeningTestRequested,
      mapLaboratoryTestFormDataToApi(formData.cancerScreeningTestData),
    ),
    hpvTestData: guardValue(
      formData.hpvTestRequested,
      mapLaboratoryTestFormDataToApi(formData.hpvTestData),
    ),
    mpoxTestData: guardValue(
      formData.mpoxTestRequested,
      mapLaboratoryTestFormDataToApi(formData.mpoxTestData),
    ),
    otherTestName: guardValue(
      formData.otherTestRequested,
      mapOptionalString(formData.otherTestName),
    ),
    otherTestData: guardValue(
      formData.otherTestRequested,
      mapLaboratoryTestFormDataToApi(formData.otherTestData),
    ),
  };
}

interface LaboratoryTestExaminationProps {
  procedureId: string;
  laboratoryTestExamination: ApiLaboratoryTestExamination;
}

export function LaboratoryTestExamination(
  props: LaboratoryTestExaminationProps,
) {
  const { procedureId, laboratoryTestExamination: laboratoryTests } = props;
  const upsertLaboratoryTests = useUpsertLaboratoryTest(procedureId);

  function onSubmit(values: LaboratoryTestExaminationData) {
    return upsertLaboratoryTests.mutateAsync({
      laboratoryTests: mapFormValuesToApi(values),
    });
  }

  const { openCancelDialog } = useConfirmationDialog();

  function onCancel(
    dirty: boolean,
    reset: (
      state?: Partial<FormikState<LaboratoryTestExaminationData>>,
    ) => void,
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
        laboratoryTests
          ? mapToFormValues(laboratoryTests)
          : defaultLaboratoryTestExaminationFormValues()
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
                  <Sheet sx={{ padding: 3 }}>
                    <Stack gap={3}>
                      <Typography level="h2">{"Labortests"}</Typography>
                      <Grid
                        xxs={12}
                        md={12}
                        lg={6.66}
                        xxl={6.66}
                        paddingLeft={0}
                      >
                        <InputField
                          name={"sampleBarcode"}
                          label={"Proben-Barcode"}
                        />
                      </Grid>
                      <Divider />
                      <Typography level="h3">{"Verordnete Tests"}</Typography>
                      <LaboratoryTestWithBooleanResult
                        testRequestedPath={"hivTestRequested"}
                        label={"HIV (Labortest)"}
                        dataPath={"hivTestData"}
                      />
                      <Divider />
                      <LaboratoryTestWithBooleanResult
                        testRequestedPath={"syphilisTestRequested"}
                        label={"Syphilis (Labortest)"}
                        dataPath={"syphilisTestData"}
                        bottomField={
                          <CheckboxField
                            name={"hadSyphilis"}
                            label={"Hatte Syphilis"}
                          />
                        }
                      />
                      <Divider />
                      <HepatitisLaboratoryTest
                        dataPath={"hepATestData"}
                        testRequestedPath={"hepATestRequested"}
                        label={"Hepatitis A"}
                        bottomField={<HepatitisInfo variant="A" />}
                      />
                      <Divider />
                      <HepatitisLaboratoryTest
                        dataPath={"hepBTestData"}
                        testRequestedPath={"hepBTestRequested"}
                        label={"Hepatitis B"}
                        bottomField={<HepatitisInfo variant="B" />}
                      />
                      <Divider />
                      <LaboratoryTestWithBooleanResult
                        dataPath={"hepCTestData"}
                        testRequestedPath={"hepCTestRequested"}
                        label={"Hepatitis C"}
                        bottomField={<HepatitisInfo variant="C" />}
                      />
                      <Divider />
                      <LaboratoryTestSamples
                        dataPath={"chlamydiaTestData"}
                        testRequestedPath={"chlamydiaTestRequested"}
                        label={"Chlamydia"}
                      />
                      <Divider />
                      <LaboratoryTestSamples
                        dataPath={"gonorrheaTestData"}
                        testRequestedPath={"gonorrheaTestRequested"}
                        label={"Gonorrhoe"}
                      />
                      <Divider />
                      <LaboratoryTestSamples
                        dataPath={"mycoplasmaTestData"}
                        testRequestedPath={"mycoplasmaTestRequested"}
                        label={"Mykoplasmen"}
                      />
                      <Divider />
                      <LaboratoryTestWithBooleanResult
                        testRequestedPath={"cancerScreeningTestRequested"}
                        label={"Krebsvorsorge"}
                        dataPath={"cancerScreeningTestData"}
                      />
                      <Divider />
                      <LaboratoryTestWithBooleanResult
                        testRequestedPath={"hpvTestRequested"}
                        label={"HPV-Abstrich"}
                        dataPath={"hpvTestData"}
                      />
                      <Divider />
                      <LaboratoryTestWithBooleanResult
                        testRequestedPath={"mpoxTestRequested"}
                        label={"Mpox"}
                        dataPath={"mpoxTestData"}
                      />
                      <Divider />
                      <LaboratoryTestWithBooleanResult
                        testRequestedPath={"otherTestRequested"}
                        label={"Sonstige Tests"}
                        dataPath={"otherTestData"}
                        topField={
                          <InputField name={"otherTestName"} label={"Name"} />
                        }
                      />
                    </Stack>
                  </Sheet>
                </Grid>
              </Grid>
              <Grid xxs={12} lg={3}>
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
        Labortests
      </SidePanelTitle>
      <Stack
        component="section"
        gap={3}
        aria-label={"Weitere Angaben zu den Labortests"}
      >
        <Stack paddingTop={1}>
          <Typography>Allgemeine Bemerkung</Typography>
          <TextareaField name="generalRemarks" minRows={4} />
        </Stack>
        <CheckboxField name="testsConducted" label={"Tests durchgeführt"} />
        <CheckboxField name="testsPayed" label={"Tests bezahlt"} />
      </Stack>
    </SidePanel>
  );
}

function HepatitisInfo({ variant }: { variant: "A" | "B" | "C" }) {
  return (
    <Alert
      color={"primary"}
      message={`Bei der Durchführung des Hepatits-${variant}-Tests muss eine Bescheinigung zur Meldepflicht ausgedruckt und von dem/der Bürger:in unterschrieben werden.`}
    />
  );
}
