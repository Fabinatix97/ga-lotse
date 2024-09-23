/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { Person } from "@/lib/businessModules/schoolEntry/api/models/Person";
import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

interface ProcedureTabHeaderProps {
  child: Person;
}

export function ProcedureTabHeader(props: ProcedureTabHeaderProps) {
  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>
        {formatPersonName(props.child)}
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        Geb. {formatDate(props.child.dateOfBirth)}
      </TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
