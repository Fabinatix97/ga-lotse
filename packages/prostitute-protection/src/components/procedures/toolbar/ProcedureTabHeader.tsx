/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@eshg/lib-employee-portal";
import { formatDate, formatPersonName } from "@eshg/lib-portal";

import { mockProcedures } from "../../../mock";

export function ProcedureTabHeader(props: Readonly<{ procedureId: string }>) {
  const procedure =
    mockProcedures.find((p) => p.id === props.procedureId) ??
    mockProcedures[0]!;

  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>
        {formatPersonName(procedure.person)}
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        Geb. {formatDate(procedure.person.dateOfBirth)}
      </TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
