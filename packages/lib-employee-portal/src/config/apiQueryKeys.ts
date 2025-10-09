/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryKeyFactory } from "@eshg/lib-portal";

const baseQueryKey = queryKeyFactory([["libEmployeePortal"]]);

export const userApiQueryKey = queryKeyFactory(baseQueryKey(["userApi"]));

export const personApiQueryKey = queryKeyFactory(baseQueryKey(["personApi"]));

export const facilityApiQueryKey = queryKeyFactory(
  baseQueryKey(["facilityApi"]),
);

export const contactApiQueryKey = queryKeyFactory(baseQueryKey(["contactApi"]));

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

export const inboxProcedureApiQueryKey = queryKeyFactory(
  baseQueryKey(["inboxProcedureApi"]),
);
