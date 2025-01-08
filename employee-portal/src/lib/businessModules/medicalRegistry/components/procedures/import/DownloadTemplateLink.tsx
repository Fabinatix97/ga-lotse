/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DownloadLink } from "@eshg/lib-portal/api/files/DownloadLink";
import { FileDownloadOutlined } from "@mui/icons-material";

import { useDownloadImportTemplate } from "@/lib/businessModules/medicalRegistry/api/queries/import";

export function DownloadTemplateLink() {
  const { download, downloadContainerRef } = useDownloadImportTemplate();

  return (
    <DownloadLink
      downloadContainerRef={downloadContainerRef}
      startDecorator={<FileDownloadOutlined />}
      fontSize="sm"
      onDownload={() => download()}
    >
      Beispiel-Datei herunterladen
    </DownloadLink>
  );
}
