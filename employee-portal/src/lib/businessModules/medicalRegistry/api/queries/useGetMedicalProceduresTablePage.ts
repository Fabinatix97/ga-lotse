/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import { useQueries } from "@tanstack/react-query";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import {
  getMedicalRegistryOverviewQuery,
  getMedicalRegistrySearchQuery,
} from "@/lib/businessModules/medicalRegistry/api/queries/medicalRegistryEntries";
import { getMedicalRegistryEntryFilters } from "@/lib/businessModules/medicalRegistry/shared/hooks/useMedicalRegistryFilterSettings";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

export function useGetMedicalProceduresTablePage(
  isSearchPanel: boolean,
  pageSize: number,
  pageNumber: number,
  activeValues: FilterValue[],
  searchQuery: string,
) {
  const medicalRegistryApi = useMedicalRegistryApi();

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.MedicalRegistry,
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
