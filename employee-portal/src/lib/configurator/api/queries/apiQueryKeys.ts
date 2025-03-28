/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

import { baseApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import { apiQueryKey as medicalRegistryApiQueryKey } from "@/lib/businessModules/medicalRegistry/api/queries/apiQueryKeys";
import { apiQueryKey as schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import { apiQueryKey as travelMedicineApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export const baseDepartmentInfoConfigApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["baseDepartmentInfoConfigApi"]),
);

export const measlesProtectionDepartmentInfoConfigApiQueryKey = queryKeyFactory(
  measlesProtectionApiQueryKey(["departmentInfoConfigApi"]),
);

export const medicalRegistryDepartmentInfoConfigApiQueryKey = queryKeyFactory(
  medicalRegistryApiQueryKey(["departmentInfoConfigApi"]),
);

export const schoolEntryDepartmentInfoConfigApiQueryKey = queryKeyFactory(
  schoolEntryApiQueryKey(["departmentInfoConfigApi"]),
);

export const stiConsultationDepartmentInfoConfigApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["stiConsultationDepartmentInfoConfigApi"]),
);

export const sexWorkDepartmentInfoConfigApiQueryKey = queryKeyFactory(
  stiProtectionApiQueryKey(["sexWorkDepartmentInfoConfigApi"]),
);

export const travelMedicineDepartmentInfoConfigApiQueryKey = queryKeyFactory(
  travelMedicineApiQueryKey(["departmentInfoConfigApi"]),
);
