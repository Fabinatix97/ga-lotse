/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useTaskApi } from "@/lib/businessModules/inspection/api/clients";
import { progressEntryApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";
import {
  TeamviewFilters,
  useFetchTasksForTeamViewTemplateOptions,
} from "@/lib/shared/api/queries/tasks";

export function useFetchTasksForTeamViewOptions(
  teamviewFilters: TeamviewFilters,
) {
  return useFetchTasksForTeamViewTemplateOptions({
    useTaskApi,
    queryKeyFactory: progressEntryApiQueryKey,
    teamviewFilters,
    getInitOverrides: getHeadersForOfflineCaching,
  });
}
