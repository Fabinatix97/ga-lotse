/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ApiEmployeeOmsProcedureHeader } from "@eshg/official-medical-service-api";

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
