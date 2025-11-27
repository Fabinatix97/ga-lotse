/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryKeyFactory } from "@eshg/lib-portal";

const apiQueryKey = queryKeyFactory(["inspection"]);

export const inspectionApiQueryKey = queryKeyFactory(
  apiQueryKey(["inspectionApi"]),
);

export const checklistApiQueryKey = queryKeyFactory(
  apiQueryKey(["checklistApi"]),
);

export const checklistDefinitionApiQueryKey = queryKeyFactory(
  apiQueryKey(["checklistDefinitionApi"]),
);

export const checklistDefinitionCentralRepoApiQueryKey = queryKeyFactory(
  apiQueryKey(["checklistDefinitionCentralRepoApi"]),
);

export const inventoryApiQueryKey = queryKeyFactory(
  apiQueryKey(["inventoryApi"]),
);

export const resourceApiQueryKey = queryKeyFactory(
  apiQueryKey(["resourceApi"]),
);

export const editorApiQueryKey = queryKeyFactory(apiQueryKey(["editorApi"]));

export const facilityApiQueryKey = queryKeyFactory(
  apiQueryKey(["facilityApi"]),
);

export const objectTypeApiQueryKey = queryKeyFactory(
  apiQueryKey(["objectTypeApi"]),
);

export const incidentsApiQueryKey = queryKeyFactory(
  apiQueryKey(["inspectionIncidentApi"]),
);

export const textBlockApiQueryKey = queryKeyFactory(
  apiQueryKey(["textBlockApi"]),
);

export const progressEntryApiQueryKey = queryKeyFactory(
  apiQueryKey(["progressEntryApi"]),
);

export const webSearchApiQueryKey = queryKeyFactory(
  apiQueryKey(["webSearchApi"]),
);

export const departmentApiQueryKey = queryKeyFactory(
  apiQueryKey(["departmentApi"]),
);

export const userApiQueryKey = queryKeyFactory(apiQueryKey(["userApi"]));

export const inspectionGeoApiQueryKey = queryKeyFactory(
  apiQueryKey(["inspectionGeoApi"]),
);

export const packlistApiQueryKey = queryKeyFactory(
  apiQueryKey(["packlistApi"]),
);

export const packlistDefinitionApiQueryKey = queryKeyFactory(
  apiQueryKey(["packlistDefinitionApi"]),
);

export const inspectionFeatureTogglesApiQueryKey = queryKeyFactory(
  apiQueryKey(["featureTogglesApi"]),
);

export const samplesApiQueryKey = queryKeyFactory(
  apiQueryKey(["inspectionSampleApi"]),
);

export const measurementParameterApiQueryKey = queryKeyFactory(
  apiQueryKey(["InspectionParameterAutocompleteApi"]),
);

export const sampleActorApiQueryKey = queryKeyFactory(
  apiQueryKey(["InspectionSampleActorAutocompleteApi"]),
);
