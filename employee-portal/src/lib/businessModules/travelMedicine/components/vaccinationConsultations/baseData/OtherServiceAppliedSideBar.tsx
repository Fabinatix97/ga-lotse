/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import { ApiServiceStatus } from "@eshg/employee-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { Sheet, Stack } from "@mui/joy";
import { Formik } from "formik";

import {
  UseUpdateOtherServiceRequest,
  useUpdateOtherService,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { CurrentUsers } from "@/lib/businessModules/travelMedicine/shared/currentUsers";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullName } from "@/lib/shared/components/users/userFormatter";

interface InitOtherServiceAppliedFormValues {
  procedureId: string;
  serviceId: string;
  serviceTypeDescription: string;
  serviceStatus: string;
  appliedAt: string;
  physician: string;
  medicalAssistant?: string;
}

interface OtherServiceAppliedSideBarProps {
  sideBarOpen: boolean;
  closeSideBar: () => void;
  allPhysicians: ApiUser[];
  allMedicalAssistants: ApiUser[];
  storeUsers: (currentUsers: CurrentUsers) => void;
  initialValues: InitOtherServiceAppliedFormValues;
}

export function OtherServiceAppliedSideBar(
  props: Readonly<OtherServiceAppliedSideBarProps>,
) {
  const updateOtherServiceApi = useUpdateOtherService();

  async function handleOtherServiceSideBarSubmit(
    values: InitOtherServiceAppliedFormValues,
    resetForm: () => void,
    storeUsers: (currentUsers: CurrentUsers) => void,
  ) {
    storeUsers({
      physician: values.physician,
      medicalAssistant: values.medicalAssistant ?? "",
    });

    const request: UseUpdateOtherServiceRequest = {
      procedureId: props.initialValues.procedureId,
      serviceId: props.initialValues.serviceId,
      apiRequest: {
        appliedAt: new Date(values.appliedAt),
        physician: values.physician,
        mfa: values.medicalAssistant,
      },
    };
    await updateOtherServiceApi.mutateAsync(request, {
      onSuccess: () => {
        props.closeSideBar();
        resetForm();
      },
    });
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
        onSubmit={async (values, { resetForm }) =>
          await handleOtherServiceSideBarSubmit(
            values,
            resetForm,
            props.storeUsers,
          )
        }
        enableReinitialize
      >
        {({ isSubmitting, resetForm }) => (
          <FormPlus style={{ display: "contents" }}>
            <SidebarContent
              title={
                props.initialValues.serviceStatus === ApiServiceStatus.Planned
                  ? "Leistung durchgeführt"
                  : "Leistung bearbeiten"
              }
            >
              <Stack
                direction="column"
                gap={2}
                data-testid="otherServiceApplied"
              >
                <Sheet>
                  <Stack direction="column" gap={2}>
                    <DetailsCell
                      name="serviceTypeDescription"
                      label="Leistungsart"
                      value={props.initialValues.serviceTypeDescription}
                    />
                  </Stack>
                </Sheet>
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
                    ? "Durchgeführt"
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
