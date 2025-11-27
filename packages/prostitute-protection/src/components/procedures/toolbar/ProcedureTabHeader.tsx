/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@eshg/lib-employee-portal";
import { formatDate, formatPersonName } from "@eshg/lib-portal";

import { useGetProcedure } from "../../../api/queries/procedures";

export function ProcedureTabHeader(props: Readonly<{ procedureId: string }>) {
  const { data: procedure } = useGetProcedure(props.procedureId);
  const { firstName, lastName, dateOfBirth } = procedure;

  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>
        {formatPersonName({
          firstName,
          lastName,
        })}
      </TabNavigationHeaderTypography>
      {isDefined(dateOfBirth) && (
        <TabNavigationHeaderTypography>
          Geb. {formatDate(new Date(dateOfBirth))}
        </TabNavigationHeaderTypography>
      )}
    </TabNavigationHeader>
  );
}
