/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal";

import { useMedicalRegistryImportApi } from "@/lib/businessModules/medicalRegistry/api/clients";

export function useDownloadImportTemplate() {
  const medicalRegistryImportApi = useMedicalRegistryImportApi();
  return useFileDownload(() => medicalRegistryImportApi.getImportTemplateRaw());
}
