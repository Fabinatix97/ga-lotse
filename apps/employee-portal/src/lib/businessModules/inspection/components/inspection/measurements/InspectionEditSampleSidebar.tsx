/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { useMemo, useState } from "react";

import {
  ApiInspFacility,
  ApiInspectionSample,
  ApiInspectionSampleContact,
  ApiInspectionSampleEvaluatingActor,
  ApiInspectionSampleInspectedFacility,
  ApiInspectionSampleUser,
  ApiUpdateInspectionSampleRequest,
} from "@eshg/inspection-api";
import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { formatDateTime, formatUserName } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useUpdateSample } from "@/lib/businessModules/inspection/api/mutations/sample";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionSampleSidebarBasisData } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarBasisData";
import {
  InspectionSampleSidebarFormType,
  makeUpdateInspectionSampleRequest,
} from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarHelper";
import { InspectionSampleSidebarMeasurementParameterData } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarMeasurementParameterData";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

interface InspectionEditSampleSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  sample: ApiInspectionSample;
  facility: ApiInspFacility;
}

export function useInspectionEditSampleSidebar() {
  return useSidebarWithFormRef({
    component: InspectionEditSampleSidebar,
  });
}

function InspectionEditSampleSidebar({
  onClose,
  procedureId,
  sample,
  formRef,
  facility,
}: Readonly<InspectionEditSampleSidebarProps>) {
  const userApi = useUserApi();

  const [{ data: selfUser }] = useSuspenseQueries({
    queries: [getSelfUserQuery(userApi)],
  });

  const { mutateAsync: updateSample } = useUpdateSample();

  const [selectedTab, setSelectedTab] = useState(0);

  function handleClose(force?: boolean) {
    onClose(force);
  }

  async function onFinalSubmit(formValues: InspectionSampleSidebarFormType) {
    const payload: ApiUpdateInspectionSampleRequest =
      makeUpdateInspectionSampleRequest(formValues, selfUser.userId);
    await updateSample(
      {
        inspectionId: procedureId,
        sampleId: sample.sampleId,
        apiUpdateInspectionSampleRequest: payload,
      },
      {
        onSuccess: () => {
          handleClose(true);
        },
      },
    );
  }

  function getActorName(actor: ApiInspectionSampleEvaluatingActor) {
    switch (actor.type) {
      case "InspectionSampleContact":
        const inspectionSampleContact = actor as ApiInspectionSampleContact;
        return inspectionSampleContact.contact.name;
      case "InspectionSampleInspectedFacility":
        const inspectionSampleInspectedFacility =
          actor as ApiInspectionSampleInspectedFacility;
        return inspectionSampleInspectedFacility.facilityFileState.name;
      case "InspectionSampleUser":
        const inspectionSampleUser = actor as ApiInspectionSampleUser;
        return formatUserName(inspectionSampleUser.user);
    }
  }

  const initialValues: InspectionSampleSidebarFormType = useMemo(() => {
    return {
      evaluatingActor: getActorName(sample.evaluatingActor),
      evaluationType: sample.evaluationType,
      externalId: sample.sampleId,
      measurementParameters: [],
      nameOfSamplingPoint: sample.nameOfSamplingPoint,
      pointOfWithdrawal: sample.pointOfWithdrawal,
      samplingActor: getActorName(sample.samplingActor),
      timeOfEvaluation:
        sample.timeOfEvaluation && formatDateTime(sample.timeOfEvaluation),
      timeOfSampling:
        sample.timeOfSampling && formatDateTime(sample.timeOfSampling),
      typeOfSample: sample.typeOfSample,
    };
  }, [sample]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onFinalSubmit}
    >
      {({ isValid, values, setFieldValue }) => (
        <SidebarForm ref={formRef}>
          <ConfirmLeaveDirtyFormEffect />
          <SidebarContent title="Probe bearbeiten">
            <Tabs
              variant="plain"
              aria-label="Proben bearbeiten tabs"
              value={selectedTab}
              onChange={(event, value) => setSelectedTab(value as number)}
            >
              <TabList sx={{ flexGrow: 1, borderRadius: "8px" }}>
                <Tab
                  aria-label="Informationen tab"
                  sx={{
                    flexGrow: 1,
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                    backgroundColor: "#F0F4F8",
                    color: "black",
                    "&.Mui-selected": {
                      // Aktiver Zustand
                      backgroundColor: "#0B6BCB",
                      color: "white",
                    },
                    "&:hover": {
                      backgroundColor: "#F0F4F8",
                      color: "black",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#0B6BCB",
                      color: "white",
                    },
                  }}
                >
                  Informationen
                </Tab>
                <Tab
                  aria-label="Messparameter tab"
                  sx={{
                    flexGrow: 1,
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                    backgroundColor: "#F0F4F8",
                    color: "black",
                    "&.Mui-selected": {
                      backgroundColor: "#0B6BCB",
                      color: "white",
                    },
                    "&:hover": {
                      backgroundColor: "#F0F4F8",
                      color: "black",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#0B6BCB",
                      color: "white",
                    },
                  }}
                >
                  Messparameter
                </Tab>
              </TabList>
              <TabPanel value={0}>
                <InspectionSampleSidebarBasisData
                  values={values}
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
              </TabPanel>
              <TabPanel value={1}>
                <InspectionSampleSidebarMeasurementParameterData
                  values={values}
                />
              </TabPanel>
            </Tabs>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={!isValid}
              submitLabel="Probe speichern"
              onCancel={handleClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
