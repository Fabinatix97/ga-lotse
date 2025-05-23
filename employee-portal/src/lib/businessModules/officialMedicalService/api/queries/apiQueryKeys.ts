/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

export const officialMedicalServiceApiQueryKey = queryKeyFactory([
  "officialMedicalService",
]);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  officialMedicalServiceApiQueryKey(["appointmentBlockApi"]),
);

export const appointmentTypesApiQueryKey = queryKeyFactory(
  officialMedicalServiceApiQueryKey(["appointmentTypesApi"]),
);

export const appointmentStaffApiQueryKey = queryKeyFactory(
  officialMedicalServiceApiQueryKey(["appointtingStaffApi"]),
);

export const employeeOmsProcedureApiQueryKey = queryKeyFactory(
  officialMedicalServiceApiQueryKey(["employeeOmsProcedureApi"]),
);

export const concernApiQueryKey = queryKeyFactory(
  officialMedicalServiceApiQueryKey(["concernApi"]),
);

export const waitingRoomApiQueryKey = queryKeyFactory(
  officialMedicalServiceApiQueryKey(["waitingRoomApi"]),
);
