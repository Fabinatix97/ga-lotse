/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { type QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import {
  ArchivingApi,
  GetArchivableProceduresRequest,
  GetRelevantArchivableProceduresRequest,
} from "@eshg/lib-procedures-api";

import { mapArchivableProceduresResponse } from "@/lib/shared/components/archiving/api/models/archivableProcedure";

type UseGetArchivingConfigurationResult = ReturnType<
  typeof useGetArchivingConfigurationTemplate
>;
export type UseGetArchivingConfiguration =
  () => UseGetArchivingConfigurationResult;

export function useGetArchivingConfigurationTemplate(
  useArchivingApi: () => Pick<ArchivingApi, "getArchivingConfiguration">,
  queryKeyFactory: QueryKeyFactory,
) {
  const archivingApi = useArchivingApi();

  return useSuspenseQuery({
    queryKey: queryKeyFactory(["getArchivingConfiguration"]),
    queryFn: () => archivingApi.getArchivingConfiguration(),
    staleTime: 60_000,
  });
}

type UseGetArchivableProceduresResult = ReturnType<
  typeof useGetArchivableProceduresTemplate
>;
export type UseGetArchivableProcedures = (
  request: GetArchivableProceduresRequest,
) => UseGetArchivableProceduresResult;

export function useGetArchivableProceduresTemplate(
  useArchivingApi: () => Pick<ArchivingApi, "getArchivableProceduresRaw">,
  queryKeyFactory: QueryKeyFactory,
  request: GetArchivableProceduresRequest,
) {
  const archivingApi = useArchivingApi();

  return useSuspenseQuery({
    queryKey: queryKeyFactory([
      "getArchivableProcedures",
      request,
      Array.from(request.defaultArchivingRelevance ?? []),
      Array.from(request.procedureType ?? []),
    ]),
    queryFn: () =>
      archivingApi
        .getArchivableProceduresRaw(request)
        .then(unwrapRawResponse)
        .then(mapArchivableProceduresResponse),
  });
}

type UseGetRelevantArchivableProceduresResult = ReturnType<
  typeof useGetRelevantArchivableProceduresTemplate
>;
export type UseGetRelevantArchivableProcedures = (
  request: GetRelevantArchivableProceduresRequest,
) => UseGetRelevantArchivableProceduresResult;

export function useGetRelevantArchivableProceduresTemplate(
  useArchivingApi: () => Pick<
    ArchivingApi,
    "getRelevantArchivableProceduresRaw"
  >,
  queryKeyFactory: QueryKeyFactory,
  request: GetRelevantArchivableProceduresRequest,
) {
  const archivingApi = useArchivingApi();

  return useSuspenseQuery({
    queryKey: queryKeyFactory(["getRelevantArchivableProceduresRaw", request]),
    queryFn: () =>
      archivingApi
        .getRelevantArchivableProceduresRaw(request)
        .then(unwrapRawResponse),
  });
}
