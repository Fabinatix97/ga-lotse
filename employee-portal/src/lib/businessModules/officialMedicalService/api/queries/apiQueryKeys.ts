/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["officialMedicalService"]);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointmentBlockApi"]),
);

export const appointmentTypesApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointmentTypesApi"]),
);

export const appointmentStaffApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointtingStaffApi"]),
);

export const progressEntryApiQueryKey = queryKeyFactory(
  apiQueryKey(["progressEntryApi"]),
);

export const fileApiQueryKey = queryKeyFactory(apiQueryKey(["fileApi"]));

export const employeeOmsProcedureApiQueryKey = queryKeyFactory(
  apiQueryKey(["employeeOmsProcedureApi"]),
);

export const concernApiQueryKey = queryKeyFactory(apiQueryKey(["concernApi"]));

export const waitingRoomApiQueryKey = queryKeyFactory(
  apiQueryKey(["waitingRoomApi"]),
);
