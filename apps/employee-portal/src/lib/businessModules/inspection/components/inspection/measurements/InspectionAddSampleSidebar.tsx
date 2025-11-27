/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik, FormikErrors } from "formik";
import { useMemo, useRef } from "react";

import {
  ApiCreateInspectionSampleRequest,
  ApiInspFacility,
  ApiInspectionSampleEvaluationType,
  ApiInspectionSampleType,
} from "@eshg/inspection-api";
import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
  useStepper,
} from "@eshg/lib-employee-portal";
import { formatUserName } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useCreateSample } from "@/lib/businessModules/inspection/api/mutations/sample";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionSampleSidebarBasisData } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarBasisData";
import {
  InspectionSampleSidebarFormType,
  makeCreateInspectionSampleRequest,
} from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarHelper";
import { InspectionSampleSidebarMeasurementParameterData } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarMeasurementParameterData";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

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

  async function onFinalSubmit(formValues: InspectionSampleSidebarFormType) {
    const payload: ApiCreateInspectionSampleRequest =
      makeCreateInspectionSampleRequest(formValues, selfUser.userId);
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
          onSamplingActorSelection={(value) =>
            setFieldValue("samplingActor", {
              label: value?.label ?? "",
              value: value?.value ?? "",
            })
          }
          onEvaluatingActorSelection={(value) =>
            setFieldValue("evaluatingActor", {
              label: value?.label ?? "",
              value: value?.value ?? "",
            })
          }
          onSelfAssignSamplingActor={() =>
            setFieldValue("samplingActor", {
              label: formatUserName(selfUser),
              value: selfUser.userId,
            })
          }
          onSelfAssignEvaluatingActor={() =>
            setFieldValue("evaluatingActor", {
              label: formatUserName(selfUser),
              value: selfUser.userId,
            })
          }
          onFacilityAssignEvaluatingActor={() =>
            setFieldValue("evaluatingActor", {
              label: facility.baseFacility.name,
              value: facility.id,
            })
          }
          onFacilityAssignSamplingActor={() =>
            setFieldValue("samplingActor", {
              label: facility.baseFacility.name,
              value: facility.id,
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
      {({ isValid, values, setFieldValue }) => (
        <SidebarForm ref={formRef}>
          <ConfirmLeaveDirtyFormEffect />
          <SidebarContent title={step.title} subtitle={step.subTitle}>
            <Fields values={values} setFieldValue={setFieldValue} />
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
