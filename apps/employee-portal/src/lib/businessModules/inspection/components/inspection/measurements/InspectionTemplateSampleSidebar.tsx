/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik, FormikErrors } from "formik";
import { useMemo, useRef, useState } from "react";

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
import { formatUserName } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useCreateSample } from "@/lib/businessModules/inspection/api/mutations/sample";
import { useGetSampleTemplates } from "@/lib/businessModules/inspection/api/queries/sample";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionSampleSidebarBasisData } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarBasisData";
import {
  InspectionSampleSidebarFormType,
  makeCreateInspectionSampleRequest,
} from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarHelper";
import { InspectionSampleSidebarTemplateData } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarTemplateData";

interface InspectionTemplateSampleSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  facility: ApiInspFacility;
}

export function useInspectionTemplateSampleSidebar() {
  return useSidebarWithFormRef({
    component: InspectionTemplateSampleSidebar,
  });
}

function InspectionTemplateSampleSidebar({
  onClose,
  procedureId,
  formRef,
  facility,
}: Readonly<InspectionTemplateSampleSidebarProps>) {
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const userApi = useUserApi();

  const [{ data: selfUser }] = useSuspenseQueries({
    queries: [getSelfUserQuery(userApi)],
  });
  const { mutateAsync: createSample } = useCreateSample();
  const { data: templates } = useGetSampleTemplates();

  function handleClose(force?: boolean) {
    changeToStep(0);
    onClose(force);
  }

  async function onFinalSubmit(formValues: InspectionSampleSidebarFormType) {
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

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const steps = [
    {
      title: "Probe hinzufügen",
      subTitle: "Schritt 1: Vorlage",
      fields: ({
        setFieldValue,
      }: {
        setFieldValue: (
          field: string,
          value: unknown,
          shouldValidate?: boolean,
        ) => Promise<void | FormikErrors<InspectionSampleSidebarFormType>>;
      }) => (
        <InspectionSampleSidebarTemplateData
          templates={templates}
          selectedIndex={selectedIndex}
          onSelect={async (i) => {
            setSelectedIndex(i);
            await setFieldValue(
              "measurementParameters",
              templates[i]?.measurementParameters.map(
                (measurementParameter) => ({
                  parent: {
                    label: null,
                    value: measurementParameter.parameterZid,
                  },
                  child: {
                    label: null,
                    value: measurementParameter.untersuchungsparameterZid,
                  },
                }),
              ),
            );
            await setFieldValue(
              "nameOfSamplingPoint",
              templates[i]?.nameOfSamplingPoint,
            );
            await setFieldValue(
              "pointOfWithdrawal",
              templates[i]?.pointOfWithdrawal,
            );
            await setFieldValue("evaluationType", templates[i]?.evaluationType);
            await setFieldValue("typeOfSample", templates[i]?.typeOfSample);
          }}
        />
      ),
    },
    {
      title: "Probe hinzufügen",
      subTitle: "Schritt 2: Informationen",
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
      evaluatingActor: {
        label: "",
        value: { id: "", type: "InspectionSampleUserReference" },
      },
      evaluationType: ApiInspectionSampleEvaluationType.OnSite,
      externalId: "",
      measurementParameters: [],
      nameOfSamplingPoint: "",
      pointOfWithdrawal: "",
      samplingActor: {
        label: "",
        value: { id: "", type: "InspectionSampleUserReference" },
      },
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
      {({ isValid, values, setFieldValue }) => (
        <SidebarForm ref={formRef}>
          <ConfirmLeaveDirtyFormEffect />
          <SidebarContent title={step.title} subtitle={step.subTitle}>
            <Fields values={values} setFieldValue={setFieldValue} />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={!isValid}
              submitLabel={
                isOnLastStep ? "Probe hinzufügen" : "Vorlage verwenden"
              }
              onCancel={handleClose}
              onBack={isOnFirstStep ? undefined : handlePrev}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
