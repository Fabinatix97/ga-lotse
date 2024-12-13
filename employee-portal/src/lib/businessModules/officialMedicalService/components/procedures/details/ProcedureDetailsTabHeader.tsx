/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeeOmsProcedureHeader } from "@eshg/employee-portal-api/officialMedicalService";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

export function ProcedureDetailsTabHeader({
  procedureHeader,
}: {
  procedureHeader: ApiEmployeeOmsProcedureHeader;
}) {
  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>
        {procedureHeader.firstName} {procedureHeader.lastName}
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        Geb. {formatDate(procedureHeader.dateOfBirth)}
      </TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
