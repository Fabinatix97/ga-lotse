/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useIsMobile } from "@eshg/lib-portal";

import { AppointmentInfoSection } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/AppointmentInfoSection";
import { ConfirmationSection } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/ConfirmationSection";
import { AppointmentOverview } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/AppointmentOverview";
import {
  ThreeColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";

export function AppointmentReviewStep() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <TwoColumnGrid
        content={<AppointmentInfoSection />}
        sidePanel={<AppointmentOverview />}
      />
    );
  }

  return (
    <ThreeColumnGrid
      contentLeft={<AppointmentInfoSection />}
      contentRight={<AppointmentOverview />}
      sidePanel={<ConfirmationSection />}
    />
  );
}
