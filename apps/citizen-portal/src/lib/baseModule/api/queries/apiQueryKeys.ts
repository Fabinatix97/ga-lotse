/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

const apiQueryKey = queryKeyFactory(["base"]);

export const baseFeatureTogglesApiQueryKey = queryKeyFactory(
  apiQueryKey(["featureTogglesApi"]),
);

export const mukFacilityLinkApiQueryKey = queryKeyFactory(
  apiQueryKey(["mukFacilityLinkApi"]),
);

export const bundIdPersonLinkApiQueryKey = queryKeyFactory(
  apiQueryKey(["bundIdPersonLinkApi"]),
);

export const gdprProcedureApiQueryKey = queryKeyFactory(
  apiQueryKey(["gdprProcedureApi"]),
);
