/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OverviewAndAppointmentStepToggle } from "@/lib/businessModules/travelMedicine/components/appointment/OverviewAndAppointmentStepToggle";
import { AppointmentReviewStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/AppointmentReviewStep";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";

export function AppointmentFormContent() {
  const { isLastStep } = useStepContext();

  return (
    <>
      {!isLastStep ? (
        <OverviewAndAppointmentStepToggle />
      ) : (
        <AppointmentReviewStep />
      )}
    </>
  );
}
