/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

export const apiQueryKey = queryKeyFactory(["schoolEntry"]);

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

export const appointmentStaffApiQueryKey = queryKeyFactory(
  apiQueryKey(["appointtingStaffApi"]),
);

export const configApiQueryKey = queryKeyFactory(apiQueryKey(["configApi"]));
