/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Input, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  ApiCreateInspectionSampleMeasurementParameterRequest,
  ApiInspectionSample,
  ApiInspectionSampleEvaluationType,
  ApiInspectionSampleType,
  ApiUpdateInspectionSampleRequest,
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
  useSnackbar,
} from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useUpdateSample } from "@/lib/businessModules/inspection/api/mutations/sample";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import {
  translateInspectionSampleEvaluationType,
  translateInspectionSampleType,
} from "@/lib/businessModules/inspection/shared/enums";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

interface InspectionEditSampleSidebarProps extends SidebarWithFormRefProps {
  sample: ApiInspectionSample;
  procedureId: string;
  sampleId: string;
}

interface InspectionEditSampleSidebarFormType {
  evaluatingActor?: string; //ApiCreateInspectionSampleRequestEvaluatingActor;
  evaluationType: ApiInspectionSampleEvaluationType;
  measurementParameters: ApiCreateInspectionSampleMeasurementParameterRequest[];
  nameOfSamplingPoint?: string;
  pointOfWithdrawal: string;
  samplingActor: string; //ApiCreateInspectionSampleRequestEvaluatingActor;
  timeOfEvaluation?: Date;
  timeOfSampling?: Date;
  typeOfSample: ApiInspectionSampleType;
  measurementParametersToAdd: [];
  measurementParametersToDelete: [];
}

export function useInspectEditSampleSidebar() {
  return useSidebarWithFormRef({
    component: InspectionEditSampleSidebar,
  });
}
function InspectionEditSampleSidebar({
  onClose,
  sample,
  procedureId,
  sampleId,
}: Readonly<InspectionEditSampleSidebarProps>) {
  const snackbar = useSnackbar();
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  const userApi = useUserApi();

  const [{ data: selfUser }] = useSuspenseQueries({
    queries: [getSelfUserQuery(userApi)],
  });

  const { mutateAsync: updateSample } = useUpdateSample();

  function handleClose() {
    sidebarFormRef.current?.resetForm();
    changeToStep(0);
    onClose();
  }

  async function onFinalSubmit(
    formValues: InspectionEditSampleSidebarFormType,
  ) {
    const payload: ApiUpdateInspectionSampleRequest =
      mapFormToRequest(formValues);

    await updateSample(
      {
        apiUpdateInspectionSampleRequest: payload,
        inspectionId: procedureId,
        sampleId: sampleId,
      },
      {
        onSuccess: () => {
          snackbar.confirmation("Probe wurde gespeichert.");
          handleClose();
        },
      },
    );
  }

  function mapFormToRequest(
    formValues: InspectionEditSampleSidebarFormType,
  ): ApiUpdateInspectionSampleRequest {
    return {
      evaluatingActor: {
        type: "InspectionSampleUserReference",
        userId: selfUser.userId,
      },
      evaluationType: formValues.evaluationType,
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
      measurementParametersToAdd: formValues.measurementParameters,
      measurementParametersToDelete: [],
    };
  }

  const SAMPLE_TYPE_OPTIONS = Object.values(ApiInspectionSampleType).map(
    (value) => {
      return { label: translateInspectionSampleType(value), value: value };
    },
  );

  const EVALUATION_TYPE_OPTIONS = Object.values(
    ApiInspectionSampleEvaluationType,
  ).map((value) => {
    return {
      label: translateInspectionSampleEvaluationType(value),
      value: value,
    };
  });

  function createNewElement() {
    return {
      externalId: uuidv4(),
      parameterName: "",
    };
  }

  const steps = [
    {
      title: "Probe bearbeiten",
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
          <Grid xxs={12}>
            <InputField
              name="samplingActor"
              type="text"
              label="Probennehmer"
              required="Bitte Probennehmer eintragen"
            />
          </Grid>
          <Grid xxs={12}>
            <InputField
              name="evaluatingActor"
              type="text"
              label="Auswerter"
              required="Bitte Auswerter eintragen"
            />
          </Grid>
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
      title: "Probe bearbeiten",
      subTitle: "Schritt 2: Messparameter",
      fields: ({ values }: { values: InspectionEditSampleSidebarFormType }) => (
        <Grid container spacing={1} sx={{ flexGrow: 1 }}>
          <FieldArray
            valueLength={values.measurementParameters.length}
            name="measurementParameters"
          >
            {({ push, replace, remove, setInputElementRef }) => (
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
                  <Stack
                    key={elementIndex}
                    direction="row"
                    spacing={2}
                    display="flex"
                    flex={1}
                    alignContent="center"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Input
                      name="parameterName"
                      slotProps={{
                        input: {
                          ref: (el) => setInputElementRef(el!, elementIndex),
                        },
                      }}
                      sx={{ flex: 1, height: "51px" }}
                      placeholder={`Probenname für Eintrag ${elementIndex + 1} eingeben`}
                      onBlur={(event) =>
                        replace(elementIndex, {
                          ...element,
                          parameterName: event.target.value,
                        })
                      }
                    />
                    <IconButton
                      label="Löschen"
                      aria-label="Löschen"
                      onClick={() => remove(elementIndex)}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Stack>
                ))}

                <Button
                  variant="plain"
                  startDecorator={<Add />}
                  sx={{ alignSelf: "flex-start" }}
                  onClick={() => push(createNewElement())}
                >
                  Messparameter hinzufügen
                </Button>
              </Box>
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

  const initialValues: InspectionEditSampleSidebarFormType = useMemo(() => {
    return {
      measurementParametersToAdd: [],
      measurementParametersToDelete: [],
      ...sample,
      evaluatingActor: sample.evaluatingActor.type,
      samplingActor: sample.samplingActor.type,
    };
  }, [sample]);

  return (
    <Formik initialValues={initialValues} onSubmit={handleNext}>
      {({ isValid, values }) => (
        <SidebarForm ref={sidebarFormRef}>
          <ConfirmLeaveDirtyFormEffect />
          <SidebarContent title={step.title} subtitle={step.subTitle}>
            <Fields values={values} />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={!isValid}
              submitLabel={isOnLastStep ? "Probe speichern" : "Weiter"}
              onCancel={handleClose}
              onBack={isOnFirstStep ? undefined : handlePrev}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
