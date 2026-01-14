/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@eshg/lib-employee-portal";

import { useGetProcedure } from "../../../api/queries/procedures";

export function ProcedureTabHeader(props: Readonly<{ procedureId: string }>) {
  const { data: procedure } = useGetProcedure(props.procedureId);
  const { alias } = procedure;

  return (
    <TabNavigationHeader titleAsH1>
      {isDefined(alias) && (
        <TabNavigationHeaderTypography>{alias}</TabNavigationHeaderTypography>
      )}
    </TabNavigationHeader>
  );
}
