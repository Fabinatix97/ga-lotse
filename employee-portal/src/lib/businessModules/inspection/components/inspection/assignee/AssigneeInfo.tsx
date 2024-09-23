/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormLabel } from "@mui/joy";

export interface AssigneeInfoProps {
  assigneeName: string;
}

export function AssigneeInfo(props: AssigneeInfoProps) {
  return (
    <p>
      <FormLabel>Zugewiesene:r Bearbeiter:in</FormLabel>
      {props.assigneeName}
    </p>
  );
}
