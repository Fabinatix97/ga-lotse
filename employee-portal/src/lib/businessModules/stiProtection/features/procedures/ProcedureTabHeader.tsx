/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";

import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
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
          ? translateCountry(procedure.person.countryOfBirth)
          : "-"}
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        {procedure.person.yearOfBirth}
      </TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
