/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

import { EMPLOYEE_CHANGE_TYPE_NAMES } from "@eshg/medical-registry";
import { ApiEmployeeChangeType } from "@eshg/medical-registry-api";

const employeeChangeTypeColors = {
  [ApiEmployeeChangeType.Add]: "success",
  [ApiEmployeeChangeType.Remove]: "danger",
} satisfies Record<ApiEmployeeChangeType, ChipProps["color"]>;

export function EmployeeChangeTypeChip({
  changeType,
}: {
  changeType: ApiEmployeeChangeType;
}) {
  return (
    <Chip color={employeeChangeTypeColors[changeType]}>
      {EMPLOYEE_CHANGE_TYPE_NAMES[changeType]}
    </Chip>
  );
}
