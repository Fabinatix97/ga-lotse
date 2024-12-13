/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiRapidTestData,
  ApiRapidTestExamination,
} from "@eshg/employee-portal-api/stiProtection";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { Button, Divider, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { Formik, FormikState } from "formik";

import { useUpsertRapidTest } from "@/lib/businessModules/stiProtection/api/mutations/examination";
import { useGetRapidTestExaminationQuery } from "@/lib/businessModules/stiProtection/api/queries/examination";
import {
  YesOrNoFieldData,
  mapBoolToYesOrNo,
  mapYesOrNoToBool,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/YesOrNoWithFollowUp";
import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

import {
  RapidTestWithBooleanResult,
  RapidTestWithTextResult,
  RapidTestWithUnitStringResult,
} from "./RapidTestTemplates";

export function Examinations({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  return <RapidTests procedureId={procedureId} />;
}

interface RapidTestData {
  number?: string;
  result: YesOrNoFieldData;
}

function mapRapidTestToForm(testData?: ApiRapidTestData): RapidTestData {
  if (testData == undefined) {
    return {
      number: "",
      result: null,
    };
  }
  return {
    number: testData.number,
    result: mapBoolToYesOrNo(testData.result),
  };
}

function mapRapidTestToApi(
  formData: RapidTestData | null,
): ApiRapidTestData | undefined {
  if (formData === null) {
    return undefined;
  }

  const resultValue = mapYesOrNoToBool(formData.result);
  if (resultValue === undefined) {
    return undefined;
  }

  return {
    number: mapOptionalValue(formData.number?.trim()),
    result: !!resultValue,
  };
}

export interface RapidTestsFormData {
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
): RapidTestsFormData {
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

function defaultRapidTestFormValues(): RapidTestsFormData {
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
  values: RapidTestsFormData,
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

interface RapidTestsProps {
  procedureId: string;
}

function RapidTests(props: RapidTestsProps) {
  const { data: rapidTests } = useGetRapidTestExaminationQuery(
    props.procedureId,
  );

  const upsertRapidTests = useUpsertRapidTest();

  function onSubmit(values: RapidTestsFormData) {
    return upsertRapidTests.mutateAsync({
      id: props.procedureId,
      rapidTests: mapFormValuesToApi(values),
    });
  }

  const { openCancelDialog } = useConfirmationDialog();

  function onCancel(
    dirty: boolean,
    reset: (state?: Partial<FormikState<RapidTestsFormData>>) => void,
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
        rapidTests ? mapToFormValues(rapidTests) : defaultRapidTestFormValues()
      }
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ dirty, resetForm, isSubmitting }) => (
        <FormPlus style={{ height: "100%" }}>
          <MainContentLayout fullViewportHeight>
            <Grid container spacing={2}>
              <Grid container spacing={2} xs={12} lg={9}>
                <Grid xs={12}>
                  <Sheet>
                    <Stack gap={3}>
                      <Typography level="h3">{"Schnelltests"}</Typography>
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
                  <ExaminationTabs />
                  <ExaminationInfo />
                </Stack>
              </Grid>
            </Grid>
          </MainContentLayout>
          <ExaminationStickyBottomButtonBar
            isSubmitting={isSubmitting}
            onClick={() => onCancel(dirty, resetForm)}
          />
        </FormPlus>
      )}
    </Formik>
  );
}

function ExaminationTabs() {
  return (
    <Sheet>
      <DetailsSection title="Untersuchungen">
        <Typography>Schnelltests</Typography>
        <Typography>Laboruntersuchungen</Typography>
      </DetailsSection>
    </Sheet>
  );
}

function ExaminationInfo() {
  return (
    <>
      <Sheet>
        <DetailsSection title="Schnelltests">
          <Typography>Allgemeine Bemerkung</Typography>
          <TextareaField name="generalRemarks" minRows={3} />
          <CheckboxField name="testsPayed" label={"Tests bezahlt"} />
        </DetailsSection>
      </Sheet>
    </>
  );
}

interface ExaminationStickyBottomButtonBarProps {
  isSubmitting: boolean;
  onClick: () => void;
}

function ExaminationStickyBottomButtonBar(
  props: ExaminationStickyBottomButtonBarProps,
) {
  const { isSubmitting, onClick } = props;

  return (
    <StickyBottomButtonBar
      sx={{ padding: "0.75rem 1.5rem" }}
      right={
        <>
          <Button onClick={onClick}>Abbrechen</Button>
          <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
        </>
      }
    ></StickyBottomButtonBar>
  );
}
