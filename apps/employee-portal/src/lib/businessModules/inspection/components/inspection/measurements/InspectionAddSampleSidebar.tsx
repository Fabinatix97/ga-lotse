/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik, FormikErrors } from "formik";
import { useMemo, useRef, useState } from "react";
import { undefined } from "valibot";

import {
  ApiCreateInspectionSampleRequest,
  ApiInspFacility,
  ApiInspectionSampleEvaluationType,
  ApiInspectionSampleType,
} from "@eshg/inspection-api";
import {
  ConfirmLeaveDirtyFormEffect,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
  useStepper,
} from "@eshg/lib-employee-portal";
import { Alert, FormPlus, formatUserName } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useCreateSample } from "@/lib/businessModules/inspection/api/mutations/sample";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionSampleSidebarBasisData } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarBasisData";
import {
  InspectionSampleSidebarFormType,
  makeCreateInspectionSampleRequest,
} from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarHelper";
import { InspectionSampleSidebarMeasurementParameterData } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarMeasurementParameterData";

interface InspectionAddSampleSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  facility: ApiInspFacility;
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
  facility,
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

  const [measurementFilled, setMeasurementFilled] = useState("");

  async function onFinalSubmit(formValues: InspectionSampleSidebarFormType) {
    if (formValues.measurementParameters.length <= 0) {
      setMeasurementFilled(
        "Es muss mindestens ein Messparameter hinzugefügt werden!",
      );
      return;
    }
    setMeasurementFilled("");

    const payload: ApiCreateInspectionSampleRequest =
      makeCreateInspectionSampleRequest(formValues);
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

  const steps = [
    {
      title: "Probe hinzufügen",
      subTitle: "Schritt 1: Informationen",
      fields: ({
        values,
        setFieldValue,
      }: {
        values: InspectionSampleSidebarFormType;
        setFieldValue: (
          field: string,
          value: unknown,
          shouldValidate?: boolean,
        ) => Promise<void | FormikErrors<InspectionSampleSidebarFormType>>;
      }) => (
        <InspectionSampleSidebarBasisData
          values={values}
          facilityId={facility.id}
          onSamplingPointSelection={(value) =>
            setFieldValue("samplingPoint", value)
          }
          onSamplingActorSelection={(value) =>
            setFieldValue("samplingActor", value)
          }
          onEvaluatingActorSelection={(value) =>
            setFieldValue("evaluatingActor", value)
          }
          onSelfAssignSamplingActor={() =>
            setFieldValue("samplingActor", {
              label: formatUserName(selfUser),
              value: {
                id: selfUser.userId,
                type: "InspectionSampleUserReference",
              },
            })
          }
          onSelfAssignEvaluatingActor={() =>
            setFieldValue("evaluatingActor", {
              label: formatUserName(selfUser),
              value: {
                id: selfUser.userId,
                type: "InspectionSampleUserReference",
              },
            })
          }
          onFacilityAssignEvaluatingActor={() =>
            setFieldValue("evaluatingActor", {
              label: facility.baseFacility.name,
              value: {
                id: facility.baseFacility.id,
                type: "InspectionSampleInspectedFacilityReference",
              },
            })
          }
          onFacilityAssignSamplingActor={() =>
            setFieldValue("samplingActor", {
              label: facility.baseFacility.name,
              value: {
                id: facility.baseFacility.id,
                type: "InspectionSampleInspectedFacilityReference",
              },
            })
          }
        />
      ),
    },
    {
      title: "Probe hinzufügen",
      subTitle: "Schritt 2: Messparameter",
      fields: ({ values }: { values: InspectionSampleSidebarFormType }) => (
        <InspectionSampleSidebarMeasurementParameterData values={values} />
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

  const initialValues: InspectionSampleSidebarFormType = useMemo(() => {
    return {
      evaluatingActor: null,
      evaluationType: ApiInspectionSampleEvaluationType.OnSite,
      externalId: "",
      measurementParameters: [],
      sampleNumber: "",
      samplingPoint: null,
      samplingActor: null,
      timeOfEvaluation: "",
      timeOfSampling: "",
      typeOfSample: ApiInspectionSampleType.DrinkingWater,
    };
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleNext}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <SidebarForm ref={formRef}>
          <ConfirmLeaveDirtyFormEffect />
          <SidebarContent title={step.title} subtitle={step.subTitle}>
            <Grid
              container
              component={FormPlus}
              spacing={2}
              sx={{ flexGrow: 1 }}
            >
              {measurementFilled && (
                <Grid xxs={12}>
                  <Alert color="danger" message={measurementFilled} />
                </Grid>
              )}
              <Grid xxs={12}>
                <Fields values={values} setFieldValue={setFieldValue} />
              </Grid>
            </Grid>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
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
