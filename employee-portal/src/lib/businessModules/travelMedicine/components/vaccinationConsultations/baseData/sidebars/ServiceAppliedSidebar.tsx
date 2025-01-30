/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import {
  ApiServicePlanEntry,
  ApiServiceStatus,
  PatchVaccinationRequest,
} from "@eshg/travel-medicine-api";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isEmpty } from "remeda";

import { useUpdateVaccination } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  useGetAllMedicalAssistantsQuery,
  useGetAllPhysiciansQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import {
  ServiceAppliedForm,
  ServiceAppliedFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/ServiceAppliedForm";
import { determineInitialUser } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { CurrentUsers } from "@/lib/businessModules/travelMedicine/shared/currentUsers";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useServiceAppliedSidebar(): UseSidebarWithFormRefResult<ServiceAppliedSidebarProps> {
  return useSidebarWithFormRef({
    component: ServiceAppliedSidebar,
  });
}

interface ServiceAppliedSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  storedUsers: CurrentUsers;
  setStoredUsers: (currentUsers: CurrentUsers) => void;
  service: ApiServicePlanEntry;
}

function ServiceAppliedSidebar(props: Readonly<ServiceAppliedSidebarProps>) {
  const updateVaccination = useUpdateVaccination();

  const [{ data: allPhysicians }, { data: allMedicalAssistants }] =
    useSuspenseQueries({
      queries: [useGetAllPhysiciansQuery(), useGetAllMedicalAssistantsQuery()],
    });

  async function handleSubmit(values: ServiceAppliedFormValues) {
    const request: PatchVaccinationRequest = {
      procedureId: props.procedureId,
      serviceId: props.service.serviceId,
      apiPatchVaccinationRequest: {
        appliedAt: new Date(values.appliedAt),
        batchIdentifier: values.batchIdentifier.trim(),
        physician: values.physician,
        mfa: values.medicalAssistant,
      },
    };

    await updateVaccination.mutateAsync(request, {
      onSuccess: () => {
        props.setStoredUsers({
          physician: values.physician,
          medicalAssistant: values.medicalAssistant ?? "",
        });
        props.onClose(true);
      },
    });
  }

  function formatVaccinationInfo(
    diseaseName: string,
    vaccinationNumber: number,
  ) {
    return !vaccinationNumber
      ? diseaseName + " - Nr. " + vaccinationNumber
      : diseaseName;
  }

  function mapServiceAppliedValues(
    service: ApiServicePlanEntry,
  ): ServiceAppliedFormValues {
    return {
      vaccinationInfo:
        service.diseaseName && service.vaccinationNumber
          ? formatVaccinationInfo(
              service.diseaseName,
              service.vaccinationNumber,
            )
          : "",
      vaccineName: service.vaccineName ?? "",
      batchIdentifier: isEmpty(service.batchIdentifier)
        ? (service.defaultBatchIdentifier ?? "")
        : service.batchIdentifier,
      appliedAt: service.appliedAt
        ? toDateString(service.appliedAt)
        : toDateString(new Date()),
      physician: determineInitialUser(
        service.physician ?? "",
        service.status,
        allPhysicians,
        props.storedUsers.physician,
      ),
      medicalAssistant: determineInitialUser(
        service.mfa ?? "",
        service.status,
        allMedicalAssistants,
        props.storedUsers.medicalAssistant,
      ),
    };
  }

  return (
    <ServiceAppliedForm
      initialValues={mapServiceAppliedValues(props.service)}
      allPhysicians={allPhysicians}
      allMedicalAssistants={allMedicalAssistants}
      formRef={props.formRef}
      onCancel={props.onClose}
      onSubmit={handleSubmit}
      title={
        props.service.status === ApiServiceStatus.Planned
          ? "Impfung durchgeführt"
          : "Impfung bearbeiten"
      }
      submitLabel={
        props.service.status === ApiServiceStatus.Planned
          ? "Geimpft"
          : "Speichern"
      }
    />
  );
}
