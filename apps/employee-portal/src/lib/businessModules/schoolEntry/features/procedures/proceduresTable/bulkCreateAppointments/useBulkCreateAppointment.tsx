/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCreateAppointmentsInBulk } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { useBulkAppointmentCreationMessage } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/useBulkAppointmentCreationMessage";

export interface AppointmentCriteria {
  physicianId?: string;
  mfaId?: string;
  sopassId?: string;
  room?: string;
}

export interface UseBulkCreateAppointmentResult {
  startAppointmentCreation: (criteria?: AppointmentCriteria) => Promise<void>;
  isPending: boolean;
}

export function useBulkCreateAppointment(
  selectedProcedureIds: string[],
): UseBulkCreateAppointmentResult {
  const createAppointmentsInBulk = useCreateAppointmentsInBulk();
  const bulkAppointmentCreationMessage = useBulkAppointmentCreationMessage();

  async function startAppointmentCreation(criteria?: AppointmentCriteria) {
    bulkAppointmentCreationMessage.close();
    await createAppointmentsInBulk.mutateAsync(
      {
        procedureIds: selectedProcedureIds,
        ...criteria,
      },
      { onSuccess: bulkAppointmentCreationMessage.open },
    );
  }

  return {
    startAppointmentCreation,
    isPending: createAppointmentsInBulk.isPending,
  };
}
