/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { ApiAbstractFile } from "@eshg/measles-protection-api";
import { FileDownloadOutlined } from "@mui/icons-material";
import { Box } from "@mui/joy";

import { useFileApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { useGetFile } from "@/lib/businessModules/measlesProtection/api/queries/files";
import {
  FileCard,
  FileCardActionProps,
} from "@/lib/shared/components/FileCard";
import { mapToFileCardProps } from "@/lib/shared/components/procedures/progress-entries/mapper";

export interface ProofTabFileCardProps {
  fileId: string; //TODO: Remove this file-ID when all file data is provided by our own API
  fileData?: ApiAbstractFile;
}

export function ProofTabFileCard({
  fileId,
  fileData,
}: Readonly<ProofTabFileCardProps>) {
  //TODO: Remove this File-API call when all file data is provided by our own API
  const file = useGetFile(fileId);
  const fileApi = useFileApi();
  const { download } = useFileDownload((fileId: string) =>
    fileApi.downloadFileRaw({ fileId }),
  );

  const downloadActionProps: FileCardActionProps = {
    onClick: () => download(fileId),
    indicator: <FileDownloadOutlined />,
    color: "primary",
    name: "Download",
  };

  return (
    <Box width="100%">
      <FileCard
        {...mapToFileCardProps(fileData ?? file.data)}
        actions={[downloadActionProps]}
        sx={{ overflow: "auto" }}
      />
    </Box>
  );
}
