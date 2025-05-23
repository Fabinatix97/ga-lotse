/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GetCitizenMarkdownFileRequest,
  GetEmployeeMarkdownFileRequest,
} from "@eshg/base-api";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";

import { useMarkdownConfigurationApi } from "@/lib/shared/api/clients";

export function useGetCitizenMarkdownFile() {
  const markdownConfigApi = useMarkdownConfigurationApi();

  return useFileDownload((request: GetCitizenMarkdownFileRequest) =>
    markdownConfigApi.getCitizenMarkdownFileRaw(request),
  );
}

export function useGetEmployeeMarkdownFile() {
  const markdownConfigApi = useMarkdownConfigurationApi();

  return useFileDownload((request: GetEmployeeMarkdownFileRequest) =>
    markdownConfigApi.getEmployeeMarkdownFileRaw(request),
  );
}
