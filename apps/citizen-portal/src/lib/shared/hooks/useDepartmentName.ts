/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";

export function useDepartmentName() {
  const {
    data: { name },
  } = useGetDepartmentInfo();

  return name.replace(/^Gesundheitsamt\s+/, "");
}
