/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type ApiInspection } from "@eshg/inspection-api";
import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@eshg/lib-employee-portal";

import { InspectionLockInfo } from "@/lib/businessModules/inspection/components/inspection/InspectionLockInfo";
import { InspectionPhaseSelect } from "@/lib/businessModules/inspection/components/inspection/InspectionPhaseSelect";

export function InspectionTabHeader({
  inspection,
}: {
  inspection: ApiInspection;
}) {
  const facility = inspection.facility;
  const name = facility?.baseFacility.name ?? "";
  const postalAddress = facility?.baseFacility.contactAddress;
  const postalCode = postalAddress?.postalCode ?? "";
  const city = postalAddress?.city ?? "";

  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>{name}</TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        {postalCode} {city}
      </TabNavigationHeaderTypography>
      <InspectionLockInfo inspection={inspection} />
      <InspectionPhaseSelect inspection={inspection} />
    </TabNavigationHeader>
  );
}
