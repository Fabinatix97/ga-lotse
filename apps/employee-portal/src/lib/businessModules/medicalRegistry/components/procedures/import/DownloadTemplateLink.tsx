/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FileDownloadOutlined } from "@mui/icons-material";

import { ButtonLink } from "@eshg/lib-portal";

import { useDownloadImportTemplate } from "@/lib/businessModules/medicalRegistry/api/queries/import";

export function DownloadTemplateLink() {
  const { download } = useDownloadImportTemplate();

  return (
    <ButtonLink
      startDecorator={<FileDownloadOutlined />}
      fontSize="sm"
      onClick={() => download()}
    >
      Beispiel-Datei herunterladen
    </ButtonLink>
  );
}
