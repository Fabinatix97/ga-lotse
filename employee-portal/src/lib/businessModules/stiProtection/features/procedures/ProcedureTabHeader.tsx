/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { COUNTRY_CODE_LABELS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

export function ProcedureTabHeader({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const procedure = useStiProcedureQuery(procedureId).data;

  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>AZ</TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        {procedure.person.countryOfBirth
          ? COUNTRY_CODE_LABELS[procedure.person.countryOfBirth]
          : "-"}
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        {procedure.person.yearOfBirth}
      </TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
