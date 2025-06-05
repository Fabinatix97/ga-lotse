/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCreateAppointmentsInBulk } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { useBulkAppointmentCreationMessage } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/useBulkAppointmentCreationMessage";

interface UseBulkCreateAppointmentResult {
  startAppointmentCreation: () => Promise<void>;
  isPending: boolean;
}

export function useBulkCreateAppointment(
  selectedProcedureIds: string[],
): UseBulkCreateAppointmentResult {
  const createAppointmentsInBulk = useCreateAppointmentsInBulk();
  const bulkAppointmentCreationMessage = useBulkAppointmentCreationMessage();

  async function startAppointmentCreation() {
    bulkAppointmentCreationMessage.close();
    await createAppointmentsInBulk.mutateAsync(
      {
        procedureIds: selectedProcedureIds,
      },
      { onSuccess: bulkAppointmentCreationMessage.open },
    );
  }

  return {
    startAppointmentCreation,
    isPending: createAppointmentsInBulk.isPending,
  };
}
