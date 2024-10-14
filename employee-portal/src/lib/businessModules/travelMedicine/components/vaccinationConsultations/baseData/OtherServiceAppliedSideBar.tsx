/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiServiceStatus } from "@eshg/employee-portal-api/travelMedicine";
import { Sheet, Stack } from "@mui/joy";
import { Formik } from "formik";

import {
  UseUpdateOtherServiceRequest,
  useUpdateOtherService,
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

export interface OtherServiceAppliedValues {
  procedureId: string;
  serviceId: string;
  serviceTypeDescription: string;
  serviceStatus: string;
  appliedAt: string;
  physician: string;
  medicalAssistant?: string;
}

export const initialOtherServiceAppliedValues: OtherServiceAppliedValues = {
  procedureId: "",
  serviceId: "",
  serviceTypeDescription: "",
  serviceStatus: "",
  appliedAt: "",
  physician: "",
  medicalAssistant: "",
};

interface OtherServiceAppliedSideBarProps {
  open: boolean;
  onCancel: (
    currentValues: OtherServiceAppliedValues,
    initialValues: OtherServiceAppliedValues,
    dirty: boolean,
  ) => void;
  onSuccess: () => void;
  onClose: (item: VaccinationConsultationSidebarsProps) => void;
  storeUsers: (currentUsers: CurrentUsers) => void;
  currentUsers: { physician: string; medicalAssistant: string };
  initialValues: OtherServiceAppliedValues;
}

export function OtherServiceAppliedSideBar(
  props: Readonly<OtherServiceAppliedSideBarProps>,
) {
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

  const updateOtherServiceApi = useUpdateOtherService();

  async function handleOtherServiceSideBarSubmit(
    values: OtherServiceAppliedValues,
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
    await updateOtherServiceApi
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
      onSubmit={async (values) =>
        await handleOtherServiceSideBarSubmit(values, props.storeUsers)
      }
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
                  : { ...initialOtherServiceAppliedValues },
            });
          }}
        >
          <SidebarForm style={{ display: "contents" }}>
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
                    ? "Durchgeführt"
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
