/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import {
  useDeleteFileTemplate,
  useRequestFileDeletionTemplate,
} from "@/lib/shared/api/mutations/files";

export function useDeleteFile() {
  return useDeleteFileTemplate(useFileApi);
}

export function useRequestFileDeletion() {
  return useRequestFileDeletionTemplate(useFileApi);
}
