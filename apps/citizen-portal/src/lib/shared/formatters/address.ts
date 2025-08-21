/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import {
  formatList,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@eshg/lib-portal";

export function formatDepartmentAddress(
  department: ApiGetDepartmentInfoResponse,
) {
  return formatList(
    [
      department.name,
      formatStreetAndHouseNumber(department),
      formatPostalCodeAndCity(department),
    ],
    ", ",
  );
}
