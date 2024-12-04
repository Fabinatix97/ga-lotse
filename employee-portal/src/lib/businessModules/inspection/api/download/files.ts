/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useParams } from "next/navigation";

import { EditInspectionPageParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { useFileApi } from "@/lib/businessModules/inspection/api/clients";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";
import { useDownloadFile } from "@/lib/shared/api/download/files";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export function useDownloadInspectionFile() {
  const fileApi = useFileApi();
  const { id } =
    useParams<ProgressEntriesUrlParams<EditInspectionPageParams>["params"]>();
  return useDownloadFile((fileId: string) =>
    fileApi.downloadFileRaw({ fileId }, getHeadersForOfflineCaching(id)),
  );
}
