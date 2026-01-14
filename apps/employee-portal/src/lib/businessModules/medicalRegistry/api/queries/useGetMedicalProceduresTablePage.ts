/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQueries } from "@tanstack/react-query";

import {
  FilterValue,
  useGetGdprValidationBannerQuery,
} from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import {
  useGdprValidationTaskApi,
  useMedicalRegistryApi,
} from "@/lib/businessModules/medicalRegistry/api/clients";
import {
  getMedicalRegistryOverviewQuery,
  getMedicalRegistrySearchQuery,
} from "@/lib/businessModules/medicalRegistry/api/queries/medicalRegistryEntries";
import { getMedicalRegistryEntryFilters } from "@/lib/businessModules/medicalRegistry/shared/hooks/useMedicalRegistryFilterSettings";

export function useGetMedicalProceduresTablePage(
  isSearchPanel: boolean,
  pageSize: number,
  pageNumber: number,
  activeValues: FilterValue[],
  searchQuery: string,
) {
  const medicalRegistryApi = useMedicalRegistryApi();
  const gdprValidationTaskApi = useGdprValidationTaskApi();

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.MedicalRegistry,
    gdprValidationTaskApi,
  );

  const proceduresQuery = isSearchPanel
    ? getMedicalRegistrySearchQuery(medicalRegistryApi, searchQuery)
    : getMedicalRegistryOverviewQuery(medicalRegistryApi, {
        ...getMedicalRegistryEntryFilters(activeValues),
        pageSize: pageSize,
        pageNumber: pageNumber,
      });

  const [{ data: medicalHistoryData, isLoading }, gdprBanner] = useQueries({
    queries: [proceduresQuery, gdprBannerQuery],
  });

  return {
    medicalHistoryData,
    isLoading,
    gdprBanner,
  };
}
