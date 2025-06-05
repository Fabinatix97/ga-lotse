/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryOptions, useSuspenseQueries } from "@tanstack/react-query";
import assert from "assert";
import { isDefined } from "remeda";

import { useGetPublicConfig } from "@eshg/lib-employee-portal";
import {
  PortalErrorCode,
  resolveError,
  unwrapRawResponse,
} from "@eshg/lib-portal";
import {
  ApiBusinessModule,
  ApiGdprDownloadPackageInfo,
  ApiGetGdprDownloadPackagesInfoResponse,
  GdprValidationTaskApiInterface,
  GetAllGdprValidationTasksRequest,
} from "@eshg/lib-procedures-api";

import { useGdprProcedureApi } from "@/lib/baseModule/api/clients";
import { gdprValidationTaskApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";
import { useGdprValidationTaskApi } from "@/lib/shared/api/clients";

const businessModules = Object.freeze(
  Object.values(ApiBusinessModule).filter(
    (businessModule) => businessModule !== ApiBusinessModule.MedsAbroad,
  ),
);

export function getGdprValidationTaskDetailsQuery(
  taskApi: GdprValidationTaskApiInterface,
  businessModule: ApiBusinessModule,
  id: string,
) {
  return queryOptions({
    queryKey: gdprValidationTaskApiQueryKey([
      businessModule,
      "getGdprValidationTaskDetails",
      id,
    ]),
    queryFn: () => taskApi.getGdprValidationTaskDetails(id),
  });
}

export function getGdprValidationTasksQuery(
  taskApi: GdprValidationTaskApiInterface,
  businessModule: ApiBusinessModule,
  request: GetAllGdprValidationTasksRequest,
) {
  return queryOptions({
    queryKey: gdprValidationTaskApiQueryKey([
      businessModule,
      "getGdprValidationTasks",
      request,
    ]),
    queryFn: () =>
      taskApi.getAllGdprValidationTasksRaw(request).then(unwrapRawResponse),
  });
}

interface DownloadPackagesQueryResponse {
  businessModule: ApiBusinessModule;
  downloadPackages: ApiGdprDownloadPackageInfo[];
}

function getGdprDownloadPackagesInfoQuery(
  taskApi: GdprValidationTaskApiInterface,
  businessModule: ApiBusinessModule,
  gdprProcedureId: string,
  enabled: boolean,
) {
  return queryOptions({
    queryKey: gdprValidationTaskApiQueryKey([
      businessModule,
      "getGdprDownloadPackagesInfo",
      gdprProcedureId,
      enabled,
    ]),
    queryFn: async (): Promise<
      "disabled" | ApiGetGdprDownloadPackagesInfoResponse
    > => {
      if (enabled) {
        try {
          return await taskApi.getGdprDownloadPackagesInfo(gdprProcedureId);
        } catch (e: unknown) {
          const resolved = resolveError(e);
          if (resolved.errorCode === PortalErrorCode.NotFound) {
            return "disabled";
          }
          throw e;
        }
      } else {
        return "disabled";
      }
    },
    select: (data): DownloadPackagesQueryResponse => {
      if (data === "disabled") {
        return {
          businessModule,
          downloadPackages: [],
        };
      } else {
        return {
          businessModule,
          downloadPackages: data.downloadPackages,
        };
      }
    },
  });
}

export function useGetGdprDownloadPackagesInfo(
  gdprProcedureId: string,
  enabled: boolean,
) {
  const { data: config } = useGetPublicConfig();
  const queries = businessModules.map((module) => {
    // Using hooks in a loop is allowed here, since the businessModules array is constant.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const gdprValidationTaskApi = useGdprValidationTaskApi(module);
    return getGdprDownloadPackagesInfoQuery(
      gdprValidationTaskApi,
      module,
      gdprProcedureId,
      enabled && config.activeModules.includes(module),
    );
  });

  return useSuspenseQueries({
    queries,
  });
}

export function useDownloadPackageFileByModule() {
  const moduleApiHooks = businessModules.map((module) => ({
    module,
    // Using hooks in a loop is allowed here, since the businessModules array is constant.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    api: useGdprValidationTaskApi(module),
  }));

  function downloadPackage(
    businessModule: ApiBusinessModule,
    gdprProcedureId: string,
    downloadId: string,
  ) {
    const resolved = moduleApiHooks.find(
      ({ module }) => module === businessModule,
    )!;
    assert(
      isDefined(resolved),
      `Module mapping for API should be defined for business module ${businessModule}`,
    );
    return resolved.api.getGdprDownloadPackageRaw({
      gdprProcedureId,
      downloadId,
    });
  }

  return downloadPackage;
}

export function useDownloadBaseModulePackage() {
  const gdprApi = useGdprProcedureApi();
  return (gdprProcedureId: string) =>
    gdprApi.getCentralFileDownloadPackageRaw({ id: gdprProcedureId });
}
