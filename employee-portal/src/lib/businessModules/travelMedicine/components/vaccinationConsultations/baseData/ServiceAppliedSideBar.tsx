/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiServiceStatus } from "@eshg/employee-portal-api/travelMedicine";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Sheet, Stack } from "@mui/joy";
import { Formik } from "formik";

import {
  UseUpdateVaccinationRequest,
  useUpdateVaccination,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  useGetAllMedicalAssistantsUnsuspended,
  useGetAllPhysiciansUnsuspended,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import { AppliedByFields } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AppliedByFields";
import { VaccinationConsultationSidebarsProps } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { determineInitialUser } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { CurrentUsers } from "@/lib/businessModules/travelMedicine/shared/currentUsers";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { sortUsersByName } from "@/lib/shared/helpers/users";
import { validateRequiredBatchId } from "@/lib/shared/helpers/validators";

export interface ServiceAppliedValues {
  procedureId: string;
  serviceId: string;
  serviceStatus: string;
  vaccinationInfo: string;
  vaccineName: string;
  batchIdentifier: string;
  appliedAt: string;
  physician: string;
  medicalAssistant?: string;
}

export const initialServiceAppliedValues: ServiceAppliedValues = {
  procedureId: "",
  serviceId: "",
  serviceStatus: "",
  vaccinationInfo: "",
  vaccineName: "",
  batchIdentifier: "",
  appliedAt: "",
  physician: "",
  medicalAssistant: "",
};

interface ServiceAppliedSideBarProps {
  open: boolean;
  onCancel: (
    currentValues: ServiceAppliedValues,
    initialValues: ServiceAppliedValues,
    dirty: boolean,
  ) => void;
  onSuccess: () => void;
  onClose: (item: VaccinationConsultationSidebarsProps) => void;
  storeUsers: (currentUsers: CurrentUsers) => void;
  currentUsers: { physician: string; medicalAssistant: string };
  initialValues: ServiceAppliedValues;
}

export function ServiceAppliedSideBar(
  props: Readonly<ServiceAppliedSideBarProps>,
) {
  const updateVaccination = useUpdateVaccination();

  const getAllPhysicians = useGetAllPhysiciansUnsuspended(props.open);
  const allPhysicians = getAllPhysicians.data
    ? getAllPhysicians.data.toSorted(sortUsersByName)
    : [];

  const getAllMedicalAssistants = useGetAllMedicalAssistantsUnsuspended(
    props.open,
  );
  const allMedicalAssistants = getAllMedicalAssistants.data
    ? getAllMedicalAssistants.data.toSorted(sortUsersByName)
    : [];

  async function handleServiceSideBarSubmit(
    values: ServiceAppliedValues,
    storeUsers: (currentUsers: CurrentUsers) => void,
  ) {
    storeUsers({
      physician: values.physician,
      medicalAssistant: values.medicalAssistant ?? "",
    });

    const request: UseUpdateVaccinationRequest = {
      procedureId: props.initialValues.procedureId,
      serviceId: props.initialValues.serviceId,
      requestData: {
        appliedAt: new Date(values.appliedAt),
        batchIdentifier: values.batchIdentifier.trim(),
        physician: values.physician,
        mfa: values.medicalAssistant,
      },
    };
    await updateVaccination
      .mutateAsync(request, {
        onSuccess: props.onSuccess,
      })
      .catch();
  }

  return (
    <Formik
      initialValues={{
        ...props.initialValues,
        physician: determineInitialUser(
          props.initialValues.physician,
          props.initialValues.serviceStatus,
          allPhysicians,
          props.currentUsers.physician,
        ),
        medicalAssistant: determineInitialUser(
          props.initialValues.medicalAssistant!,
          props.initialValues.serviceStatus,
          allMedicalAssistants,
          props.currentUsers.medicalAssistant,
        ),
      }}
      onSubmit={async (values) => {
        await handleServiceSideBarSubmit(values, props.storeUsers);
      }}
      enableReinitialize
    >
      {({ isSubmitting, values, dirty }) => (
        <Sidebar
          open={props.open}
          onClose={() => {
            props.onClose({
              open: false,
              initialValues:
                props.initialValues.serviceStatus === ApiServiceStatus.Planned
                  ? { ...values }
                  : { ...initialServiceAppliedValues },
            });
          }}
        >
          <SidebarForm style={{ display: "contents" }}>
            <SidebarContent
              title={
                props.initialValues.serviceStatus === ApiServiceStatus.Planned
                  ? "Impfung durchgeführt"
                  : "Impfung bearbeiten"
              }
            >
              <Stack direction="column" gap={2} data-testid="serviceApplied">
                <Sheet>
                  <Stack direction="column" gap={2}>
                    <DetailsCell
                      name="vaccinationInfo"
                      label="Impfung"
                      value={props.initialValues.vaccinationInfo}
                    />
                    <DetailsCell
                      name="vaccineName"
                      label="Impfstoff"
                      value={props.initialValues.vaccineName}
                    />
                  </Stack>
                </Sheet>
                <InputField
                  name="batchIdentifier"
                  label="Charge"
                  required="Bitte geben Sie eine Charge an"
                  validate={validateRequiredBatchId}
                />
                <AppliedByFields
                  allPhysicians={allPhysicians}
                  allMedicalAssistants={allMedicalAssistants}
                />
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitLabel={
                  props.initialValues.serviceStatus === ApiServiceStatus.Planned
                    ? "Geimpft"
                    : "Speichern"
                }
                submitting={isSubmitting}
                onCancel={() => {
                  props.onCancel(values, props.initialValues, dirty);
                }}
              />
            </SidebarActions>
          </SidebarForm>
        </Sidebar>
      )}
    </Formik>
  );
}
