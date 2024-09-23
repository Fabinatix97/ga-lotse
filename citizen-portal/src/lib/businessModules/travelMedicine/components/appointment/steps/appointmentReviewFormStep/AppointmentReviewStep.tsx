/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentInfoSection } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/AppointmentInfoSection";
import { ConfirmationSection } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/ConfirmationSection";
import { AppointmentOverview } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/AppointmentOverview";
import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import {
  ThreeColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";

export function AppointmentReviewStep() {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile ? (
        <ThreeColumnGrid
          contentLeft={<AppointmentInfoSection />}
          contentRight={<AppointmentOverview />}
          sidePanel={<ConfirmationSection />}
        />
      ) : (
        <TwoColumnGrid
          content={<AppointmentInfoSection />}
          sidePanel={<AppointmentOverview />}
        />
      )}
    </>
  );
}
