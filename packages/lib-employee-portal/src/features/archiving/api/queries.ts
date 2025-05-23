/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { queryKeyFactory, unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiBusinessModule,
  ArchivingApiInterface,
  GetArchivableProceduresRequest,
  GetRelevantArchivableProceduresRequest,
} from "@eshg/lib-procedures-api";

import { mapArchivableProceduresResponse } from "./models/archivableProcedure";

const archivingApiQueryKey = queryKeyFactory(["archivingApi"]);

export function useGetArchivingConfiguration(
  archivingApi: ArchivingApiInterface,
  businessModule: ApiBusinessModule,
) {
  return useSuspenseQuery({
    queryKey: archivingApiQueryKey([
      "getArchivingConfiguration",
      businessModule,
    ]),
    queryFn: () => archivingApi.getArchivingConfiguration(),
    staleTime: 60_000,
  });
}

export function useGetArchivableProcedures(
  archivingApi: ArchivingApiInterface,
  businessModule: ApiBusinessModule,
  request: GetArchivableProceduresRequest,
) {
  return useSuspenseQuery({
    queryKey: archivingApiQueryKey([
      "getArchivableProcedures",
      businessModule,
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

export function useGetRelevantArchivableProcedures(
  archivingApi: ArchivingApiInterface,
  businessModule: ApiBusinessModule,
  request: GetRelevantArchivableProceduresRequest,
) {
  return useSuspenseQuery({
    queryKey: archivingApiQueryKey([
      "getRelevantArchivableProceduresRaw",
      businessModule,
      request,
    ]),
    queryFn: () =>
      archivingApi
        .getRelevantArchivableProceduresRaw(request)
        .then(unwrapRawResponse),
  });
}
