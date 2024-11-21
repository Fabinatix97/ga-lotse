/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["schoolEntry"]);

export const schoolEntryApiQueryKey = queryKeyFactory(
  apiQueryKey(["schoolEntryApi"]),
);

export const schoolEntryFeatureTogglesApiQueryKey = queryKeyFactory(
  apiQueryKey(["schoolEntryFeatureTogglesApi"]),
);

export const countryCodesApiQueryKey = queryKeyFactory(
  apiQueryKey(["countryCodesApi"]),
);

export const appointmentBlockApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointmentBlockApi"]),
);

export const valueEvaluatorApiQueryKey = queryKeyFactory(
  apiQueryKey(["valueEvaluatorApi"]),
);

export const inboxProcedureApiQueryKey = queryKeyFactory(
  apiQueryKey(["inboxProcedureApi"]),
);

export const progressEntryApiQueryKey = queryKeyFactory(
  apiQueryKey(["progressEntryApi"]),
);

export const appointmentStaffApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointtingStaffApi"]),
);

export const fileApiQueryKey = queryKeyFactory(apiQueryKey(["fileApi"]));

export const configApiQueryKey = queryKeyFactory(apiQueryKey(["configApi"]));

export const archivingApiQueryKey = queryKeyFactory(
  apiQueryKey(["archivingApi"]),
);

export const gdprValidationTaskApiQueryKey = queryKeyFactory(
  apiQueryKey(["gdprValidationTaskApi"]),
);
