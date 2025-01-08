/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import {
  useDeleteFileTemplate,
  useRequestFileDeletionTemplate,
} from "@/lib/shared/api/mutations/files";

export function useDeleteFile() {
  return useDeleteFileTemplate(
    useFileApi,
    measlesProtectionApiQueryKey(["files"]),
  );
}

export function useRequestFileDeletion() {
  return useRequestFileDeletionTemplate(
    useFileApi,
    measlesProtectionApiQueryKey(["files"]),
  );
}
