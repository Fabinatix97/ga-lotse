/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DownloadButton } from "@eshg/lib-portal/api/files/DownloadButton";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import { Button } from "@mui/joy";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { isSafari } from "@/lib/businessModules/inspection/shared/isSafari";

export function ReportDownloadButtons({
  reportId,
}: Readonly<{ reportId: string }>) {
  const api = useInspectionApi();
  const reportFile = useFileDownload(() => api.downloadReportRaw({ reportId }));

  return (
    <>
      <DownloadButton
        downloadContainerRef={reportFile.downloadContainerRef}
        onDownload={() => reportFile.download()}
        variant="plain"
        color="neutral"
        startDecorator={<FileDownloadOutlined />}
      >
        Download
      </DownloadButton>
      {!isSafari() && (
        // Safari does not support previewing blob URLs.
        //  Because the normal download already gives a preview in Safari, we just hide the button.
        <Button
          variant="plain"
          color="neutral"
          startDecorator={<RemoveRedEyeOutlined />}
          onClick={() => reportFile.preview()}
        >
          Vorschau
        </Button>
      )}
    </>
  );
}
