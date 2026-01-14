/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";

import { FileCard } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal";
import { ApiVersion } from "@eshg/opendata-api";

import { useOpenDataApi } from "@/lib/opendata/api/clients";

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
