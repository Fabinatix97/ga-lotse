/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileApi } from "@/lib/businessModules/stiProtection/api/clients";
import { fileApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import {
  useDeleteFileTemplate,
  useRequestFileDeletionTemplate,
} from "@/lib/shared/api/mutations/files";

export function useDeleteFile() {
  return useDeleteFileTemplate(useFileApi, fileApiQueryKey([]));
}

export function useRequestFileDeletion() {
  return useRequestFileDeletionTemplate(useFileApi, fileApiQueryKey([]));
}
