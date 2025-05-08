/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

export const baseApiQueryKey = queryKeyFactory(["base"]);

export const calendarApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["calendarApi"]),
);

export const contactApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["contactApi"]),
);

export const personApiQueryKey = queryKeyFactory(["personApi"]);

export const facilityApiQueryKey = queryKeyFactory(["facilityApi"]);

export const inventoryApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["inventoryApi"]),
);

export const gdprProcedureApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["gdprProcedureApi"]),
);

export const gdprValidationTaskApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["gdprValidationTaskApi"]),
);

export const resourceApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["resourceApi"]),
);

export const userApiQueryKey = queryKeyFactory(baseApiQueryKey(["userApi"]));

export const procedureApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["procedure-aggregation-api"]),
);

export const taskMetricsApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["task-metrics-api"]),
);

export const notificationsApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["notifications-api"]),
);

export const baseFeatureTogglesApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["featureTogglesApi"]),
);

export const configApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["configApi"]),
);

export const departmentApiQueryKey = queryKeyFactory(
  baseApiQueryKey(["departmentApi"]),
);
