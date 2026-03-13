/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  GetCitizenMarkdownFileRequest,
  GetEmployeeMarkdownFileRequest,
} from "@eshg/base-api";
import { useFileDownload } from "@eshg/lib-portal";

import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

export function useGetCitizenMarkdownFile() {
  const markdownConfigApi = useDepartmentConfigurationApi();

  return useFileDownload((request: GetCitizenMarkdownFileRequest) =>
    markdownConfigApi.getCitizenMarkdownFileRaw(request),
  );
}

export function useGetEmployeeMarkdownFile() {
  const markdownConfigApi = useDepartmentConfigurationApi();

  return useFileDownload((request: GetEmployeeMarkdownFileRequest) =>
    markdownConfigApi.getEmployeeMarkdownFileRaw(request),
  );
}
