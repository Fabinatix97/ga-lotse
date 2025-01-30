/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  CitizenAuthApi,
  CitizenPublicApi,
  Configuration,
  TravelMedicineFeatureTogglesPublicApi,
} from "@eshg/travel-medicine-api";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_TRAVEL_MEDICINE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useCitizenPublicApi() {
  return new CitizenPublicApi(useConfiguration());
}

export function useCitizenAuthApi() {
  return new CitizenAuthApi(useConfiguration());
}

export function useFeatureTogglesApi() {
  return new TravelMedicineFeatureTogglesPublicApi(useConfiguration());
}
