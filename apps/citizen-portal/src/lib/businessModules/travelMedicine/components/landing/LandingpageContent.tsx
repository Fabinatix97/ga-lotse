/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useGetDepartmentInfoQuery,
  useGetOpeningHoursQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { ContactAndAvailabilitySheet } from "@/lib/shared/components/ContactAndAvailabilitySheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function LandingpageContent() {
  const [{ data: department }, { data: openingHours }] = useSuspenseQueries({
    queries: [useGetDepartmentInfoQuery(), useGetOpeningHoursQuery()],
  });

  return (
    <GridColumnStack>
      <ContactAndAvailabilitySheet
        openingHoursSectionProps={{
          openingHourTranslations: openingHours,
        }}
        departmentInfo={department}
      />
    </GridColumnStack>
  );
}
