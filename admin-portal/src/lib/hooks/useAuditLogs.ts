/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiExportResponse,
  ServiceDirectoryAdminApi,
} from "@eshg/admin-portal-api/serviceDirectory";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { BackendError, useAdminApi } from "@/lib/api/clients";
import { Revision } from "@/lib/components/view/audit-log/AuditLog";
import { hours } from "@/lib/helpers/datetime";

function fetchUsernames(
  adminApi: ServiceDirectoryAdminApi,
): () => Promise<string[]> {
  return async (): Promise<string[]> => {
    return await adminApi.getUsernames().then(
      (response) => {
        return response.usernames;
      },
      (error: BackendError | Error) => {
        if (error.message.startsWith("Failed to fetch"))
          throw new Error("FetchFailed");
        if ("status" in error) throw new Error(error.status.toString());
        else throw new Error(error.message);
      },
    );
  };
}

function fetchRevisions(
  adminApi: ServiceDirectoryAdminApi,
  fromInclusive: string | undefined,
  toExclusive: string | undefined,
  username: string | undefined,
): () => Promise<Revision[]> {
  return async (): Promise<Revision[]> => {
    if (!fromInclusive || !toExclusive || fromInclusive > toExclusive) {
      return [];
    }
    return await adminApi
      .getRevisions(new Date(fromInclusive), new Date(toExclusive), username)
      .then(
        (response) =>
          response.revisions.map((r) => ({
            ...r,
            id: r.id.toString(),
          })),
        (error: BackendError | Error) => {
          if (error.message.startsWith("Failed to fetch"))
            throw new Error("FetchFailed");
          if ("status" in error) throw new Error(error.status.toString());
          else throw new Error(error.message);
        },
      );
  };
}

function fetchExport(
  adminApi: ServiceDirectoryAdminApi,
): () => Promise<ApiExportResponse> {
  return async (): Promise<ApiExportResponse> => {
    return await adminApi.getExport().then(
      (response) => {
        return response;
      },
      (error: BackendError | Error) => {
        if (error.message.startsWith("Failed to fetch"))
          throw new Error("FetchFailed");
        if ("status" in error) throw new Error(error.status.toString());
        else throw new Error(error.message);
      },
    );
  };
}

export function useAuditLogsQuery(
  fromInclusive: string | undefined,
  toExclusive: string | undefined,
  username: string | undefined,
  confirmed: boolean,
) {
  const adminApi = useAdminApi();

  return useQuery({
    queryKey: ["audit-revisions", fromInclusive, toExclusive, username],
    queryFn: fetchRevisions(adminApi, fromInclusive, toExclusive, username),
    enabled: confirmed,
    throwOnError: false,
  });
}

export function useExportQuery() {
  const adminApi = useAdminApi();

  return useQuery({
    queryKey: ["audit-export"],
    queryFn: fetchExport(adminApi),
    throwOnError: false,
  });
}

export function useUsernames() {
  const adminApi = useAdminApi();

  const { isPending, isError, data } = useQuery({
    queryKey: ["audit-usernames"],
    queryFn: fetchUsernames(adminApi),
    refetchOnWindowFocus: true,
    refetchInterval: hours(1),
    throwOnError: false,
  });

  return useMemo(() => {
    if (isPending || isError) {
      return [];
    }
    return data;
  }, [isPending, isError, data]);
}
