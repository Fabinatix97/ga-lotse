/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  ApiCreateInspectionSampleRequest,
  ApiInspectionSampleEvaluationType,
  ApiInspectionSampleType,
} from "@eshg/inspection-api";
import {
  DateTimeField,
  IconButton,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
  useStepper,
} from "@eshg/lib-employee-portal";
import {
  FieldArrayWithFocus as FieldArray,
  FormPlus,
  InputField,
  SelectField,
} from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useCreateSample } from "@/lib/businessModules/inspection/api/mutations/sample";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { MeasurementParameterField } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/MeasurementParameterField";
import {
  EVALUATION_TYPE_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
} from "@/lib/businessModules/inspection/shared/constants";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

interface InspectionAddSampleSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

export interface InspectionAddSampleSidebarFormType {
  evaluatingActor?: string; //ApiCreateInspectionSampleRequestEvaluatingActor;
  evaluationType: ApiInspectionSampleEvaluationType;
  measurementParameters: string[];
  nameOfSamplingPoint?: string;
  pointOfWithdrawal: string;
  samplingActor: string; //ApiCreateInspectionSampleRequestEvaluatingActor;
  timeOfEvaluation?: string;
  timeOfSampling?: string;
  typeOfSample: ApiInspectionSampleType;
}

export function useInspectionAddSampleSidebar() {
  return useSidebarWithFormRef({
    component: InspectionAddSampleSidebar,
  });
}

function InspectionAddSampleSidebar({
  onClose,
  procedureId,
  formRef,
}: Readonly<InspectionAddSampleSidebarProps>) {
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const userApi = useUserApi();

  const [{ data: selfUser }] = useSuspenseQueries({
    queries: [getSelfUserQuery(userApi)],
  });

  const { mutateAsync: createSample } = useCreateSample();

  function handleClose(force?: boolean) {
    changeToStep(0);
    onClose(force);
  }

  async function onFinalSubmit(formValues: InspectionAddSampleSidebarFormType) {
    const payload: ApiCreateInspectionSampleRequest =
      mapFormToRequest(formValues);
    await createSample(
      { inspectionId: procedureId, apiCreateInspectionSampleRequest: payload },
      {
        onSuccess: () => {
          sidebarFormRef.current?.resetForm();
          handleClose(true);
        },
      },
    );
  }

  function mapFormToRequest(
    formValues: InspectionAddSampleSidebarFormType,
  ): ApiCreateInspectionSampleRequest {
    return {
      evaluatingActor: {
        type: "InspectionSampleUserReference",
        userId: selfUser.userId,
      },
      evaluationType: formValues.evaluationType,
      externalId: uuidv4(),
      measurementParameters: formValues.measurementParameters.map((zid) => {
        return {
          externalId: uuidv4(),
          uParameterZid: zid,
        };
      }),
      nameOfSamplingPoint: formValues.nameOfSamplingPoint,
      pointOfWithdrawal: formValues.pointOfWithdrawal,
      samplingActor: {
        type: "InspectionSampleUserReference",
        userId: selfUser.userId,
      },
      timeOfEvaluation: formValues.timeOfEvaluation
        ? new Date(formValues.timeOfEvaluation)
        : undefined,
      timeOfSampling: formValues.timeOfSampling
        ? new Date(formValues.timeOfSampling)
        : undefined,
      typeOfSample: formValues.typeOfSample,
    };
  }

  const steps = [
    {
      title: "Probe hinzufügen",
      subTitle: "Schritt 1: Informationen",
      fields: () => (
        <Grid container component={FormPlus} spacing={1} sx={{ flexGrow: 1 }}>
          <Grid xxs={12}>
            <InputField
              name="pointOfWithdrawal"
              type="text"
              label="Entnahmestelle"
              required="Bitte eine Entnahmestelle eingeben"
            />
          </Grid>
          <Grid xxs={12}>
            <SelectField
              name="typeOfSample"
              label="Art der Probe"
              options={SAMPLE_TYPE_OPTIONS}
              required="Bitte Art der Probe auswählen"
            />
          </Grid>
          <Grid xxs={12}>
            <InputField
              name="nameOfSamplingPoint"
              type="text"
              label="Name der Probennahmestelle"
              required="Bitte Namen der Probennahmestelle eingeben"
            />
          </Grid>
          <Grid xxs={12}>
            <SelectField
              name="evaluationType"
              label="Auswertungsart"
              options={EVALUATION_TYPE_OPTIONS}
              required="Bitte Auswertungsart auswählen"
            />
          </Grid>
          <Divider />
          <Grid xxs={12}>
            <InputField
              name="samplingActor"
              type="text"
              label="Probennehmer"
              required="Bitte Probennehmer eintragen"
            />
          </Grid>
          <Divider />
          <Grid xxs={12}>
            <InputField
              name="evaluatingActor"
              type="text"
              label="Auswerter"
              required="Bitte Auswerter eintragen"
            />
          </Grid>
          <Divider />
          <Grid xxs={12}>
            <DateTimeField
              name="timeOfSampling"
              label="Zeitpunkt der Probennahme"
            />
          </Grid>
          <Grid xxs={12}>
            <DateTimeField
              name="timeOfEvaluation"
              label="Zeitpunkt der Auswertung"
            />
          </Grid>
        </Grid>
      ),
    },
    {
      title: "Probe hinzufügen",
      subTitle: "Schritt 2: Messparameter",
      fields: ({ values }: { values: InspectionAddSampleSidebarFormType }) => (
        <Grid container spacing={1} sx={{ display: "grid" }}>
          <FieldArray
            valueLength={values.measurementParameters.length}
            name="measurementParameters"
          >
            {({ push, remove }) => (
              <>
                <Box
                  sx={{
                    display: "grid",
                    flexDirection: "column",
                    gap: 2,
                    paddingBottom: 2,
                    paddingTop: 1,
                  }}
                >
                  {values.measurementParameters.map((element, elementIndex) => (
                    <Stack key={elementIndex} direction="row" spacing={2}>
                      <MeasurementParameterField
                        label={`${elementIndex + 1}. Messparameter`}
                        name={`measurementParameters.${elementIndex}`}
                        placeholder={`Messparameter ${elementIndex + 1} auswählen`}
                        required={`Messparameter ${elementIndex + 1} auswählen`}
                      />
                      {values.measurementParameters.length >= 2 && (
                        <IconButton
                          label="Löschen"
                          aria-label="Löschen"
                          sx={{
                            borderColor:
                              "var(--global--color-danger-outlined-border)",
                            borderRadius: "var(--joy-radius-sm)",
                            borderWidth: "1px",
                            height: "36px",
                            width: "36px",
                            alignSelf: "flex-end",
                          }}
                          onClick={() => remove(elementIndex)}
                        >
                          <DeleteOutlined color="danger" />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                    display: "flex",
                  }}
                >
                  <Button
                    variant="plain"
                    startDecorator={<Add />}
                    sx={{ alignSelf: "flex-end" }}
                    onClick={() => push("")}
                  >
                    Messparameter hinzufügen
                  </Button>
                </Box>
              </>
            )}
          </FieldArray>
        </Grid>
      ),
    },
  ];

  const {
    Fields,
    handleNext,
    handlePrev,
    changeToStep,
    step,
    isOnFirstStep,
    isOnLastStep,
  } = useStepper({ steps, onFinalSubmit });

  const initialValues: InspectionAddSampleSidebarFormType = useMemo(() => {
    return {
      evaluatingActor: "",
      evaluationType: ApiInspectionSampleEvaluationType.OnSite,
      externalId: "",
      measurementParameters: [],
      nameOfSamplingPoint: "",
      pointOfWithdrawal: "",
      samplingActor: "",
      timeOfEvaluation: undefined,
      timeOfSampling: undefined,
      typeOfSample: ApiInspectionSampleType.DrinkingWater,
    };
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleNext}
    >
      {({ isValid, values }) => (
        <SidebarForm ref={formRef}>
          <ConfirmLeaveDirtyFormEffect />
          <SidebarContent title={step.title} subtitle={step.subTitle}>
            <Fields values={values} />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={!isValid}
              submitLabel={isOnLastStep ? "Probe hinzufügen" : "Weiter"}
              onCancel={handleClose}
              onBack={isOnFirstStep ? undefined : handlePrev}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
