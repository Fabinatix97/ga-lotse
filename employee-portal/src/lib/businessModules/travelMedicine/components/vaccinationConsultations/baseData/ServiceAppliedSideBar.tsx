/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUser } from "@eshg/employee-portal-api/base";
import { ApiServiceStatus } from "@eshg/employee-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { Sheet, Stack } from "@mui/joy";
import { Formik } from "formik";

import {
  UseUpdateVaccinationRequest,
  useUpdateVaccination,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { CurrentUsers } from "@/lib/businessModules/travelMedicine/shared/currentUsers";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullName } from "@/lib/shared/components/users/userFormatter";
import { validateRequiredBatchId } from "@/lib/shared/helpers/validators";

interface InitServiceAppliedFormValues {
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

interface ServiceAppliedSideBarProps {
  sideBarOpen: boolean;
  closeSideBar: () => void;
  allPhysicians: ApiUser[];
  allMedicalAssistants: ApiUser[];
  storeUsers: (currentUsers: CurrentUsers) => void;
  initialValues: InitServiceAppliedFormValues;
}

export function ServiceAppliedSideBar(
  props: Readonly<ServiceAppliedSideBarProps>,
) {
  const updateVaccination = useUpdateVaccination();
  async function handleServiceSideBarSubmit(
    values: InitServiceAppliedFormValues,
    resetForm: () => void,
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
        onSuccess: () => {
          props.closeSideBar();
          resetForm();
        },
      })
      .catch();
  }

  const physicianOptions = props.allPhysicians.map((option) => ({
    value: option.userId,
    label: fullName(option),
  }));

  const medicalAssistantOptions = props.allMedicalAssistants.map((option) => ({
    value: option === undefined ? "" : option.userId,
    label: option === undefined ? "" : fullName(option),
  }));

  return (
    <Sidebar open={props.sideBarOpen} onClose={props.closeSideBar}>
      <Formik
        initialValues={props.initialValues}
        onSubmit={async (values, { resetForm }) => {
          await handleServiceSideBarSubmit(values, resetForm, props.storeUsers);
        }}
        enableReinitialize
      >
        {({ isSubmitting, resetForm }) => (
          <FormPlus style={{ display: "contents" }}>
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
                <DateField
                  name="appliedAt"
                  label="Datum"
                  required="Bitte geben Sie ein Datum an"
                />
                <SingleAutocompleteField
                  label="Durchführende(r) Arzt/Ärztin"
                  name="physician"
                  required="Bitte eine(n) Arzt/Ärztin auswählen"
                  options={physicianOptions}
                />
                <SingleAutocompleteField
                  label="Arzthilfe"
                  name="medicalAssistant"
                  options={medicalAssistantOptions}
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
