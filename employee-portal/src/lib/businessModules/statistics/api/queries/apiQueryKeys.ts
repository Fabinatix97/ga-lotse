/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

const apiQueryKey = queryKeyFactory(["statistics"]);

export const evaluationApiQueryKey = queryKeyFactory(
  apiQueryKey(["evaluationApi"]),
);

export const getEvaluationsQueryKey = queryKeyFactory(
  evaluationApiQueryKey(["getEvaluations"]),
);

export const getEvaluationReportsQueryKey = queryKeyFactory(
  evaluationApiQueryKey(["getEvaluationReports"]),
);

export const analysisApiQueryKey = queryKeyFactory(
  apiQueryKey(["analysisApi"]),
);

export const dataSourceApiQueryKey = queryKeyFactory(
  apiQueryKey(["dataSourceApi"]),
);

export const evaluationTemplateApiQueryKey = queryKeyFactory(
  apiQueryKey(["evaluationTemplateApi"]),
);

export const geoShapeApiQueryKey = queryKeyFactory(
  apiQueryKey(["geoShapeApi"]),
);

export const filterTemplateApiQueryKey = queryKeyFactory(
  apiQueryKey(["filterTemplateApi"]),
);

export const statisticsFeatureTogglesApiQueryKey = queryKeyFactory(
  apiQueryKey(["statisticsFeatureTogglesApi"]),
);

export const reportApiQueryKey = queryKeyFactory(apiQueryKey(["reportApi"]));

export const statisticsCentralRepositoryApiQueryKey = queryKeyFactory(
  apiQueryKey(["statisticsCentralRepositoryApi"]),
);
