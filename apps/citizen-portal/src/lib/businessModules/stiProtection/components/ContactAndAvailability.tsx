/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConcern } from "@eshg/sti-protection-api";

import {
  useDepartmentInfo,
  useOpeningHours,
} from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";
import { ContactAndAvailabilitySheet } from "@/lib/shared/components/ContactAndAvailabilitySheet";

interface ContactAndAvailabilityProps {
  concern: ApiConcern;
}

export function ContactAndAvailability({
  concern,
}: ContactAndAvailabilityProps) {
  const { data: departmentInfo } = useDepartmentInfo(concern);
  const { data: openingHours } = useOpeningHours(concern);

  return (
    <ContactAndAvailabilitySheet
      openingHoursSectionProps={{
        openingHourTranslations: openingHours,
      }}
      departmentInfo={departmentInfo}
    />
  );
}
