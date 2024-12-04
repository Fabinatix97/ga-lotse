/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiUserRole,
  BaseFeatureTogglesApi,
  DepartmentApi,
  PublicConfigApi,
  UserApi,
} from "@eshg/employee-portal-api/base";
import {
  ChecklistApi,
  EditorApi,
  FacilityApi,
  FileApi,
  InspectionApi,
  InspectionFeatureTogglesApi,
  InspectionIncidentApi,
  PacklistApi,
  ProcedureApi,
  ProgressEntryApi,
} from "@eshg/employee-portal-api/inspection";
import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { isNonNullish } from "remeda";

import {
  useBaseFeatureTogglesApi,
  useConfigApi,
  useDepartmentApi,
  useUserApi,
} from "@/lib/baseModule/api/clients";
import {
  baseFeatureTogglesApiQueryKey,
  configApiQueryKey,
  userApiQueryKey,
} from "@/lib/baseModule/api/queries/apiQueryKey";
import {
  useChecklistApi,
  useEditorApi,
  useFacilityApi,
  useFileApi,
  useIncidentApi,
  useInspectionApi,
  useInspectionFeatureTogglesApi,
  usePacklistApi,
  useProcedureApi,
  useProgressEntryApi,
} from "@/lib/businessModules/inspection/api/clients";
import {
  editorApiQueryKey,
  facilityApiQueryKey,
  incidentsApiQueryKey,
  inspectionFeatureTogglesApiQueryKey,
  progressEntryApiQueryKey,
} from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getChecklistsQueryKey } from "@/lib/businessModules/inspection/api/queries/checklist";
import { getDepartmentQueryKey } from "@/lib/businessModules/inspection/api/queries/department";
import {
  getAvailableCLDVsQueryKey,
  getAvailablePLDRsQueryKey,
  getInspectionQueryKey,
} from "@/lib/businessModules/inspection/api/queries/inspection";
import { getPacklistsQueryKey } from "@/lib/businessModules/inspection/api/queries/packlist";
import { moduleUserGroup } from "@/lib/businessModules/inspection/shared/moduleUserGroup";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";
import { chunkArray } from "@/lib/businessModules/inspection/shared/offline/password/chunkArray";
import { routes as inspectionRoutes } from "@/lib/businessModules/inspection/shared/routes";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

/**
 * This hook fetches all pages and API calls needed for one inspection  in offline mode.
 *
 * It contains a long list of `fetch` calls, executed by `queryClient.fetchQuery()`.
 * The `fetchQuery()` calls use the same _query keys_ as in the use hooks of the
 * inspection dialog components (except for the queries for progress-entries,
 * where it's hard to use exactly the same query keys). The corresponding
 * use hooks are named in comments. Whenever you change something in those
 * use hooks, you must also apply the change here!
 *
 * Most `fetchQuery()` calls are executed in parallel, using `Promise.all()`, for
 * performance reasons. But some are `await`ed because the response is needed.
 * The promises are executed in chunks of 8 in parallel, to avoid server rate
 * limiting issues.
 *
 */
export function usePrecacheInspections() {
  const queryClient = useQueryClient();

  const configApi = useConfigApi();
  const departmentApi = useDepartmentApi();
  const userApi = useUserApi();
  const baseFeatureTogglesApi = useBaseFeatureTogglesApi();
  const inspectionFeatureTogglesApi = useInspectionFeatureTogglesApi();
  const inspectionApi = useInspectionApi();
  const checklistApi = useChecklistApi();
  const incidentApi = useIncidentApi();
  const editorApi = useEditorApi();
  const fileApi = useFileApi();
  const progressEntryApi = useProgressEntryApi();
  const procedureApi = useProcedureApi();
  const packlistApi = usePacklistApi();
  const facilityApi = useFacilityApi();

  const fetchApprovalRequests = useHasUserRoleCheck(
    ApiUserRole.InspectionLeader,
  );

  // execute async call in this synchronous hook
  return useCallback(
    (inspectionId: string) => {
      return prefetchAll({
        inspectionIds: [inspectionId],
        queryClient,
        configApi,
        departmentApi,
        userApi,
        baseFeatureTogglesApi,
        inspectionFeatureTogglesApi,
        inspectionApi,
        checklistApi,
        incidentApi,
        editorApi,
        fileApi,
        progressEntryApi,
        procedureApi,
        packlistApi,
        facilityApi,
        fetchApprovalRequests,
      });
    },
    [
      baseFeatureTogglesApi,
      checklistApi,
      configApi,
      departmentApi,
      editorApi,
      fetchApprovalRequests,
      fileApi,
      incidentApi,
      inspectionApi,
      inspectionFeatureTogglesApi,
      packlistApi,
      facilityApi,
      procedureApi,
      progressEntryApi,
      queryClient,
      // snackbar,
      userApi,
    ],
  );
}

async function prefetchAll({
  inspectionIds,
  queryClient,
  configApi,
  departmentApi,
  userApi,
  baseFeatureTogglesApi,
  inspectionFeatureTogglesApi,
  inspectionApi,
  checklistApi,
  incidentApi,
  editorApi,
  fileApi,
  progressEntryApi,
  procedureApi,
  packlistApi,
  facilityApi,
  fetchApprovalRequests,
}: {
  inspectionIds: string[];
  queryClient: QueryClient;
  configApi: PublicConfigApi;
  departmentApi: DepartmentApi;
  userApi: UserApi;
  baseFeatureTogglesApi: BaseFeatureTogglesApi;
  inspectionFeatureTogglesApi: InspectionFeatureTogglesApi;
  inspectionApi: InspectionApi;
  checklistApi: ChecklistApi;
  incidentApi: InspectionIncidentApi;
  editorApi: EditorApi;
  fileApi: FileApi;
  progressEntryApi: ProgressEntryApi;
  procedureApi: ProcedureApi;
  packlistApi: PacklistApi;
  facilityApi: FacilityApi;
  fetchApprovalRequests: boolean;
}) {
  // 1. pre-fetch inspection procedure related queries
  for (const inspectionId of inspectionIds) {
    const inspPromises: Promise<unknown>[] = [];
    const headers = getHeadersForOfflineCaching(inspectionId);

    // 1.1 pre-fetch useGetInspection()
    //     this gets executed immediately because we need the response
    const inspection = await queryClient.fetchQuery({
      queryKey: getInspectionQueryKey(inspectionId),
      queryFn: () => inspectionApi.getInspection(inspectionId, headers),
    });

    // 1.2 pre-fetch useGetChecklists()
    //     this gets executed immediately because we need the response
    const checklists = await queryClient.fetchQuery({
      queryKey: getChecklistsQueryKey(inspectionId),
      queryFn: () => checklistApi.getChecklists(inspectionId, headers),
    });

    // 1.3 pre-fetch useGetAvailableCLDVs()
    inspPromises.push(
      queryClient.fetchQuery({
        queryKey: getAvailableCLDVsQueryKey(inspectionId),
        queryFn: () => inspectionApi.getAvailableCLDs(inspectionId, headers),
      }),
    );

    // 1.4 pre-fetch useGetIncidents()
    inspPromises.push(
      queryClient.fetchQuery({
        queryKey: incidentsApiQueryKey(["getIncidents", { inspectionId }]),
        queryFn: () => incidentApi.getIncidents(inspectionId, headers),
      }),
    );

    // 1.5 pre-fetch useLoadEditor(reportId, inspectionId) and downloadReport
    if (isNonNullish(inspection.reportId)) {
      inspPromises.push(
        queryClient.fetchQuery({
          queryKey: editorApiQueryKey([
            "loadEditor",
            { reportId: inspection.reportId, inspectionId },
          ]),
          queryFn: () => editorApi.loadEditor(inspection.reportId!, headers),
        }),
        inspectionApi.downloadReport(inspection.reportId, headers),
      );
    }

    // 1.6 pre-fetch download report file
    if (isNonNullish(inspection.reportInfo)) {
      inspPromises.push(
        fileApi.downloadFileRaw(
          { fileId: inspection.reportInfo.fileContentId },
          headers,
        ),
      );
    }

    // 1.7 pre-fetch checklist image and audio files
    checklists.checklists
      .flatMap(({ sections }) => sections)
      .flatMap(({ elements }) => elements)
      .filter((element) => element.type === "IMAGE")
      .flatMap(({ imageMetaData }) => imageMetaData)
      .forEach(({ imageID }) => {
        inspPromises.push(checklistApi.checklistGetFile(imageID, headers));
      });
    checklists.checklists
      .flatMap(({ sections }) => sections)
      .flatMap(({ elements }) => elements)
      .filter((element) => element.type === "AUDIO")
      .flatMap(({ audioMetaData }) => audioMetaData)
      .forEach(({ audioID }) => {
        inspPromises.push(checklistApi.checklistGetFile(audioID, headers));
      });

    // 1.8 pre-fetch useFetchProgressEntries() aka useFetchProgressEntriesTemplate()
    const pgQueryKey = queryKeyFactory(
      progressEntryApiQueryKey([
        "fetchProgressEntries",
        inspectionId,
        "pre-fetch",
        `${fetchApprovalRequests}`,
      ]),
    );
    // 1.8.1 pre-fetch progress entries
    //       this gets executed immediately because we need the response
    const pgResponse = await queryClient.fetchQuery({
      queryKey: pgQueryKey(["progressEntries"]),
      queryFn: () =>
        progressEntryApi.getProgressEntries(
          inspectionId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "DESC",
          200,
          undefined,
          headers,
        ),
    });
    // 1.8.2 pre-fetch useFetchProgressEntryDetailsTemplate()
    for (const { progressEntryId: entryId } of pgResponse.progressEntries) {
      inspPromises.push(
        queryClient.fetchQuery({
          queryKey: progressEntryApiQueryKey([
            "fetchProgressEntryDetails",
            inspectionId,
            entryId,
            "true",
          ]),
          queryFn: () =>
            progressEntryApi.getProgressEntry(inspectionId, entryId, headers),
        }),
      );
      // pre-fetch progress entry details page
      inspPromises.push(
        ...precachePage(
          inspectionRoutes.procedures
            .progressEntries(inspectionId)
            .details(entryId),
          headers,
        ),
      );
    }
    // 1.8.3 pre-fetch progress entries file details
    inspPromises.push(
      queryClient.fetchQuery({
        queryKey: pgQueryKey(["procedureFileDetails"]),
        queryFn: () =>
          procedureApi.getProcedureFileDetails(inspectionId, headers),
      }),
    );
    // 1.8.4 pre-fetch progress entries procedure details
    inspPromises.push(
      queryClient.fetchQuery({
        queryKey: pgQueryKey(["detailedProcedure"]),
        queryFn: () => procedureApi.getDetailedProcedure(inspectionId, headers),
      }),
    );
    // 1.8.5 fetch progress entries approval requests if needed
    if (fetchApprovalRequests) {
      inspPromises.push(
        queryClient.fetchQuery({
          queryKey: pgQueryKey(["approvalRequests"]),
          queryFn: () =>
            procedureApi.getApprovalRequests(inspectionId, headers),
        }),
      );
    }

    // 1.9 pre-fetch useGetPacklists()
    inspPromises.push(
      queryClient.fetchQuery({
        queryKey: getPacklistsQueryKey(inspectionId),
        queryFn: () => packlistApi.getPacklists(inspectionId, headers),
      }),
    );
    // 1.9.1 pre-fetch useGetAvailablePLDRs()
    inspPromises.push(
      queryClient.fetchQuery({
        queryKey: getAvailablePLDRsQueryKey(inspectionId),
        queryFn: () => inspectionApi.getAvailablePLDs(inspectionId, headers),
      }),
    );

    // 1.10 pre-fetch inspection related pages
    const pages = [
      inspectionRoutes.procedures.basedata,
      inspectionRoutes.procedures.planning,
      inspectionRoutes.procedures.execution,
      inspectionRoutes.procedures.reportResult,
      (id: string) => inspectionRoutes.procedures.progressEntries(id).index,
      inspectionRoutes.procedures.details,
      inspectionRoutes.procedures.history,
    ];
    pages.forEach((page) => {
      inspPromises.push(...precachePage(page(inspectionId), headers));
    });

    // 1.11 pre-fetch useGetFacilityHistory()
    inspPromises.push(
      queryClient.fetchQuery({
        queryKey: facilityApiQueryKey([
          "getFacilityHistory",
          {
            inspectionId: inspection.externalId,
            facilityId: inspection.facility.id,
          },
        ]),
        queryFn: () =>
          facilityApi.getFacilityHistory(inspection.facility.id, headers),
      }),
    );

    // 1.12 execute all inspection related promises
    await executeInChunks(inspPromises);
  }

  const promises: Promise<unknown>[] = [];

  // 2. pre-fetch general api requests
  // 2.1 pre-fetch useServerConfig()
  promises.push(
    queryClient.fetchQuery({
      queryKey: configApiQueryKey(["getConfig"]),
      queryFn: () => configApi.getConfigRaw(getHeadersForOfflineCaching()),
    }),
  );
  // 2.2 pre-fetch useGetDepartment()
  promises.push(
    queryClient.fetchQuery({
      queryKey: getDepartmentQueryKey(),
      queryFn: () =>
        departmentApi.getDepartmentInfo(getHeadersForOfflineCaching()),
    }),
  );
  // 2.3 pre-fetch useGetUsersByGroupQuery(moduleUserGroup.group)
  promises.push(
    queryClient.fetchQuery({
      queryKey: userApiQueryKey(["getUsersByGroup", moduleUserGroup.group]),
      queryFn: () =>
        userApi.getUsersByGroup(
          moduleUserGroup.group,
          getHeadersForOfflineCaching(),
        ),
    }),
  );
  // 2.4 pre-fetch useGetSelfUser
  promises.push(
    queryClient.fetchQuery({
      queryKey: userApiQueryKey(["getSelfUser"]),
      queryFn: () => userApi.getSelfUser(getHeadersForOfflineCaching()),
    }),
  );
  // 2.5 pre-fetch getSelfUserPermissions
  promises.push(
    queryClient.fetchQuery({
      queryKey: userApiQueryKey(["getSelfUserPermissions"]),
      queryFn: () =>
        userApi.getSelfUserPermissions(getHeadersForOfflineCaching()),
    }),
  );
  // 2.6 pre-fetch useGetBaseFeatureToggle
  promises.push(
    queryClient.fetchQuery({
      queryKey: baseFeatureTogglesApiQueryKey(["getFeatureToggles"]),
      queryFn: () =>
        baseFeatureTogglesApi.getFeatureToggles(getHeadersForOfflineCaching()),
    }),
  );
  // 2.7 pre-fetch inspection's useFeatureToggleQuery
  promises.push(
    queryClient.fetchQuery({
      queryKey: inspectionFeatureTogglesApiQueryKey(["getFeatureToggles"]),
      queryFn: () =>
        inspectionFeatureTogglesApi.getFeatureToggles(
          getHeadersForOfflineCaching(),
        ),
    }),
  );

  // 3. pre-fetch general pages
  const procedureIndexUrl = inspectionRoutes.procedures.index;
  promises.push(
    ...precachePage(procedureIndexUrl, getHeadersForOfflineCaching()),
  );
  promises.push(...precachePage("/~offline", getHeadersForOfflineCaching()));

  // 4. execute all promises for general requests
  await executeInChunks(promises);
}

function precachePage(url: string, preCacheForOfflineModeHeaders: RequestInit) {
  const headers = new Headers(preCacheForOfflineModeHeaders.headers);
  headers.set("RSC", "1");
  return [
    fetch(new Request(url, preCacheForOfflineModeHeaders)),
    fetch(
      new Request(url, {
        ...preCacheForOfflineModeHeaders,
        headers,
      }),
    ),
  ];
}

/** Execute promises in chunks of 8, to prevent overflow and rate limiting. */
async function executeInChunks<T>(promises: Promise<T>[]) {
  const chunks = chunkArray(promises, 8);
  for (const chunk of chunks) {
    await Promise.all(chunk);
  }
}
