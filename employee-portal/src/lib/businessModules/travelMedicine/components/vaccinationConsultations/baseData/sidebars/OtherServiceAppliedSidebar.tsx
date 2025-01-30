/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import {
  ApiServicePlanEntry,
  ApiServiceStatus,
  PatchOtherServiceRequest,
} from "@eshg/travel-medicine-api";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useUpdateOtherService } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  useGetAllMedicalAssistantsQuery,
  useGetAllPhysiciansQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import {
  OtherServiceAppliedForm,
  OtherServiceAppliedFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/OtherServiceAppliedForm";
import { determineInitialUser } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { CurrentUsers } from "@/lib/businessModules/travelMedicine/shared/currentUsers";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useOtherServiceAppliedSidebar(): UseSidebarWithFormRefResult<OtherServiceAppliedSidebarProps> {
  return useSidebarWithFormRef({
    component: OtherServiceAppliedSidebar,
  });
}

interface OtherServiceAppliedSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  storedUsers: CurrentUsers;
  setStoredUsers: (currentUsers: CurrentUsers) => void;
  service: ApiServicePlanEntry;
}

function OtherServiceAppliedSidebar(
  props: Readonly<OtherServiceAppliedSidebarProps>,
) {
  const updateOtherServiceApi = useUpdateOtherService();

  const [{ data: allPhysicians }, { data: allMedicalAssistants }] =
    useSuspenseQueries({
      queries: [useGetAllPhysiciansQuery(), useGetAllMedicalAssistantsQuery()],
    });

  async function handleSubmit(values: OtherServiceAppliedFormValues) {
    const request: PatchOtherServiceRequest = {
      procedureId: props.procedureId,
      serviceId: props.service.serviceId,
      apiPatchOtherServiceRequest: {
        appliedAt: new Date(values.appliedAt),
        physician: values.physician,
        mfa: values.medicalAssistant,
      },
    };
    await updateOtherServiceApi.mutateAsync(request, {
      onSuccess: () => {
        props.setStoredUsers({
          physician: values.physician,
          medicalAssistant: values.medicalAssistant ?? "",
        });
        props.onClose(true);
      },
    });
  }

  function mapOtherServiceAppliedValues(
    service: ApiServicePlanEntry,
  ): OtherServiceAppliedFormValues {
    return {
      serviceTypeDescription: service.serviceTypeDescription,
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
    <OtherServiceAppliedForm
      initialValues={mapOtherServiceAppliedValues(props.service)}
      allPhysicians={allPhysicians}
      allMedicalAssistants={allMedicalAssistants}
      formRef={props.formRef}
      onCancel={props.onClose}
      onSubmit={handleSubmit}
      title={
        props.service.status === ApiServiceStatus.Planned
          ? "Leistung durchgeführt"
          : "Leistung bearbeiten"
      }
      submitLabel={
        props.service.status === ApiServiceStatus.Planned
          ? "Durchgeführt"
          : "Speichern"
      }
    />
  );
}
