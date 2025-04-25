/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileDownloadOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useCallback } from "react";

import { ApiExportResponse } from "@eshg/service-directory-api";

import { SubHeader } from "@/lib/components/header/SubHeader";
import { QueryDependentContent } from "@/lib/components/view/PageContent";
import { saveDownload } from "@/lib/helpers/files";
import { useExportQuery } from "@/lib/hooks/useAuditLogs";
import { useTranslation } from "@/lib/i18n/client";

export function ExportContent() {
  const { t } = useTranslation();

  return (
    <>
      <SubHeader header={t("exportHeader")} />
      <QueryDependentContent
        query={useExportQuery()}
        renderContent={(data) => <ExportButton data={data} />}
      />
    </>
  );
}

function ExportButton({ data }: Readonly<{ data: ApiExportResponse }>) {
  const { t } = useTranslation();

  const handleExport = useCallback(() => {
    function downloadExport() {
      const json = JSON.stringify(data);
      return new Blob([json], { type: "application/json" });
    }

    saveDownload(
      `sd-configuration-${new Date().toISOString()}.json`,
      downloadExport,
    ).catch((error) =>
      // eslint-disable-next-line no-console
      console.error("Fetched error for downloading configuration:", error),
    );
  }, [data]);

  return (
    <Button
      sx={{
        alignSelf: "flex-start",
        marginBottom: 3,
      }}
      onClick={handleExport}
      endDecorator={<FileDownloadOutlined />}
    >
      {t("exportConfig")}
    </Button>
  );
}
