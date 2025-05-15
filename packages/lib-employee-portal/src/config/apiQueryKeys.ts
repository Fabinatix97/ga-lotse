/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const baseQueryKey = queryKeyFactory([["libEmployeePortal"]]);

export const userApiQueryKey = queryKeyFactory(baseQueryKey(["userApi"]));

export const personApiQueryKey = queryKeyFactory(baseQueryKey(["personApi"]));

export const facilityApiQueryKey = queryKeyFactory(
  baseQueryKey(["facilityApi"]),
);

export const contactApiQueryKey = queryKeyFactory(baseQueryKey(["contactApi"]));

export const streetApiQueryKey = queryKeyFactory(baseQueryKey(["streetApi"]));

export const gdprValidationTaskApi = queryKeyFactory(
  baseQueryKey(["gdprValidationTaskApi"]),
);

export const progressEntryApiQueryKey = queryKeyFactory(
  baseQueryKey(["progressEntryApi"]),
);

export const fileApiQueryKey = queryKeyFactory(baseQueryKey(["fileApi"]));

export const publicConfigApiQueryKey = queryKeyFactory(
  baseQueryKey(["publicConfigApi"]),
);
