/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { InspectionApi } from "@eshg/inspection-api";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { inspectionApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";

export function inspectionGettersQueryKey(inspectionId: string) {
  return inspectionApiQueryKey(["inspectionGetters", { inspectionId }]);
}

export function getInspectionQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getInspection",
  ]);
}

export function getAvailableCLDVsQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getAvailableCLDVs",
  ]);
}

export function getAvailablePLDRsQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getAvailablePLDRs",
  ]);
}

function getFacilityDuplicatesQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getFacilityDuplicates",
  ]);
}

function getInspectionDuplicatesQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getInspectionDuplicates",
  ]);
}

export function useGetInspection(procedureId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery(getInspectionQuery(inspectionApi, procedureId));
}

export function getInspectionQuery(
  inspectionApi: InspectionApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: getInspectionQueryKey(procedureId),
    queryFn: () =>
      inspectionApi.getInspection(
        procedureId,
        getHeadersForOfflineCaching(procedureId),
      ),
  });
}

export function useGetAvailableCLDVs(inspectionId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery(getAvailableCLDVsQuery(inspectionApi, inspectionId));
}

export function getAvailableCLDVsQuery(
  inspectionApi: InspectionApi,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: getAvailableCLDVsQueryKey(inspectionId),
    queryFn: () =>
      inspectionApi.getAvailableCLDs(
        inspectionId,
        getHeadersForOfflineCaching(inspectionId),
      ),
  });
}

export function useGetAvailablePLDRs(inspectionId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery({
    queryKey: getAvailablePLDRsQueryKey(inspectionId),
    queryFn: () =>
      inspectionApi.getAvailablePLDs(
        inspectionId,
        getHeadersForOfflineCaching(inspectionId),
      ),
  });
}

export function useGetFacilityDuplicates(procedureId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery({
    queryKey: getFacilityDuplicatesQueryKey(procedureId),
    queryFn: () => inspectionApi.getFacilityDuplicates(procedureId),
  });
}

export function useGetInspectionDuplicates(procedureId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery({
    queryKey: getInspectionDuplicatesQueryKey(procedureId),
    queryFn: () => inspectionApi.getInspectionDuplicates(procedureId),
  });
}
