/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmpty } from "remeda";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  ApiOmsAppointment,
  CancelAppointmentRequest,
} from "@eshg/official-medical-service-api";

import { useCancelAppointment } from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentApi";
import {
  CancelAppointmentForm,
  CancelAppointmentFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/CancelAppointmentForm";

export function useCancelAppointmentSidebar(): UseSidebarWithFormRefResult<CancelAppointmentSidebarProps> {
  return useSidebarWithFormRef({ component: CancelAppointmentSidebar });
}

interface CancelAppointmentSidebarProps extends SidebarWithFormRefProps {
  appointment: ApiOmsAppointment;
}

function CancelAppointmentSidebar(
  props: Readonly<CancelAppointmentSidebarProps>,
) {
  const cancelAppointment = useCancelAppointment();

  async function handleSubmit(values: CancelAppointmentFormValues) {
    const request: CancelAppointmentRequest = {
      id: props.appointment.appointmentId,
      body: !isEmpty(values.reasonForRejection)
        ? values.reasonForRejection
        : undefined,
    };
    await cancelAppointment.mutateAsync(request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  return (
    <CancelAppointmentForm
      title="Terminbuchung absagen"
      formRef={props.formRef}
      submitLabel="Termin absagen"
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
