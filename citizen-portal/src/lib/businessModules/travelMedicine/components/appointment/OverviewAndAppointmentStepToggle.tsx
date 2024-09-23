/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentOverview } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/AppointmentOverview";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

export function OverviewAndAppointmentStepToggle() {
  const { steps, currentStepIndex, isShowOverview } = useStepContext();

  return (
    <>
      {isShowOverview ? (
        <TwoColumnGrid
          content={steps[currentStepIndex]}
          sidePanel={<AppointmentOverview />}
        />
      ) : (
        steps[currentStepIndex]
      )}
    </>
  );
}
