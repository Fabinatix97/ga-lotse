/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppliedService,
  ApiCertificateType,
  ApiStepWithAppliedServices,
} from "@eshg/employee-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Stack } from "@mui/joy";
import { Formik, FormikErrors, FormikState } from "formik";

import {
  UsePostCertificateRequest,
  usePostCertificate,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { CERTIFICATE_TYPE_OPTIONS } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/options";
import {
  CheckboxGroup,
  Mode,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/CheckboxGroup";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface SidebarFormData {
  certificateType: ApiCertificateType;
  selectedProcedureStepId: string;
  appliedServices: ApiAppliedService[];
  allAppliedServices: ApiAppliedService[];
}

interface CreateCertificateSideBarProps {
  sideBarOpen: boolean;
  closeSideBar: () => void;
  stepsWithAppliedServices: ApiStepWithAppliedServices[];
  procedureId: string;
}

export function CreateCertificateSideBar(props: CreateCertificateSideBarProps) {
  return (
    <OverlayBoundary>
      <CreateCertificateSideBarSafe {...props} />
    </OverlayBoundary>
  );
}

function CreateCertificateSideBarSafe(
  props: Readonly<CreateCertificateSideBarProps>,
) {
  const postCertificate = usePostCertificate();
  const initialValues: SidebarFormData = {
    ...props,
    certificateType: ApiCertificateType.HealthInsurance,
    selectedProcedureStepId: "",
    appliedServices: [],
    allAppliedServices: [],
  };

  function validateSidebar(values: SidebarFormData) {
    const errors: FormikErrors<SidebarFormData> = {};

    if (values.certificateType === undefined) {
      errors.certificateType = "Bitte eine Bescheinigungsart auswählen";
    }
    if (
      values.selectedProcedureStepId === undefined ||
      values.selectedProcedureStepId === ""
    ) {
      errors.selectedProcedureStepId = "Bitte einen Termin auswählen";
    }

    return errors;
  }

  async function handleSubmit(
    sidebarFormData: SidebarFormData,
    resetForm: (nextState?: Partial<FormikState<SidebarFormData>>) => void,
  ) {
    const serviceIds = sidebarFormData.appliedServices.map(
      (service) => service.serviceId,
    );
    const request: UsePostCertificateRequest = {
      procedureId: props.procedureId,
      apiPostPutCertificateRequest: {
        procedureStepId: sidebarFormData.selectedProcedureStepId,
        serviceIds: serviceIds,
        type: sidebarFormData.certificateType,
      },
    };
    await postCertificate.mutateAsync(request, {
      onSuccess: () => {
        props.closeSideBar();
        resetForm();
      },
    });
  }

  function buildAppointmentOptions(): SelectOption<string, string>[] {
    return props.stepsWithAppliedServices.map((stepWithAppliedServices) => {
      return {
        label:
          formatDateTime(stepWithAppliedServices.appointmentDateTime) + " Uhr",
        value: stepWithAppliedServices.procedureStepId,
      };
    });
  }

  async function updateAppliedServicesOptions(
    procedureStepId: string,
    setFieldValue: (
      field: string,
      value: [] | ApiAppliedService[],
    ) => Promise<void | FormikErrors<SidebarFormData>>,
  ) {
    const appliedServices = props.stepsWithAppliedServices.find(
      (stepWithAppliedServices) =>
        stepWithAppliedServices.procedureStepId == procedureStepId,
    )!.appliedServices;
    await setFieldValue("appliedServices", []);
    await setFieldValue("allAppliedServices", appliedServices);
  }

  return (
    <Sidebar open={props.sideBarOpen} onClose={props.closeSideBar}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values, resetForm);
        }}
        enableReinitialize
        validate={validateSidebar}
      >
        {({ isSubmitting, values, resetForm, setFieldValue }) => (
          <FormPlus style={{ display: "contents" }}>
            <SidebarContent title={"Bescheinigung erstellen"}>
              <Stack direction="column" gap={2}>
                <SelectField
                  name="certificateType"
                  label="Bescheinigung"
                  options={CERTIFICATE_TYPE_OPTIONS}
                />
                <SelectField
                  name="selectedProcedureStepId"
                  label="Impftermin"
                  options={buildAppointmentOptions()}
                  onChange={async (procedureStepId) =>
                    await updateAppliedServicesOptions(
                      procedureStepId,
                      setFieldValue,
                    )
                  }
                />
                {values.selectedProcedureStepId !== "" ? (
                  <CheckboxGroup
                    mode={Mode.appliedService}
                    name="appliedServices"
                    label="Impfungen"
                    element={values.allAppliedServices}
                  />
                ) : null}
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitLabel="Erstellen"
                submitting={isSubmitting}
                onCancel={() => {
                  props.closeSideBar();
                  resetForm();
                }}
              />
            </SidebarActions>
          </FormPlus>
        )}
      </Formik>
    </Sidebar>
  );
}
