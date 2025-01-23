/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiVersion } from "@eshg/employee-portal-api/opendata";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";

import { useOpenDataApi } from "@/lib/opendata/api/clients";
import { FileCard } from "@/lib/shared/components/FileCard";

export function VersionFileCard({ version }: { version: ApiVersion }) {
  const { fileName, fileType, fileSize, publicationDate, externalId } = version;
  const openDataApi = useOpenDataApi();
  const { download } = useFileDownload(() =>
    openDataApi.downloadDocumentRaw({ versionId: externalId }),
  );

  return (
    <FileCard
      name={fileName}
      type={fileType}
      size={fileSize}
      creationDate={publicationDate}
      actions={[
        {
          onClick: () => download(),
          indicator: <FileDownloadOutlined />,
          color: "primary",
          name: "Herunterladen",
        },
      ]}
    />
  );
}
