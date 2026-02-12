/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FileDownloadOutlined, FileUploadOutlined } from "@mui/icons-material";
import { Box, Chip, Divider } from "@mui/joy";
import { useMemo, useState } from "react";

import { PageContent } from "@/lib/components/view/PageContent";
import { ImportContent } from "@/lib/components/view/service-directory/dataTransfer/ImportContent";
import { RuleImportContent } from "@/lib/components/view/service-directory/dataTransfer/RuleImportContent";
import { useEntities, useEntitiesQuery } from "@/lib/hooks/useEntities";

import { ExportContent } from "./dataTransfer/ExportContent";

export function ServiceDirectoryConfiguration() {
  return (
    <PageContent
      title="serviceDirectoryHeader"
      query={useEntitiesQuery()}
      renderContent={() => <ServiceDirectoryContent />}
    />
  );
}

function ServiceDirectoryContent() {
  const { committedOrgUnits, committedRules } = useEntities();
  const [isDbEmpty, setIsDbEmpty] = useState<boolean>();

  useMemo(() => {
    setIsDbEmpty(committedOrgUnits.length === 0 && committedRules.length === 0);
  }, [committedOrgUnits, committedRules]);

  return isDbEmpty ? (
    <ImportContent isDbEmpty={isDbEmpty} setIsDbEmpty={setIsDbEmpty} />
  ) : (
    <>
      <Box sx={{ my: 3 }}>
        <Divider
          sx={{
            "&::before, &::after": { opacity: 0.35 },
          }}
        >
          <Chip
            size="sm"
            variant="soft"
            startDecorator={<FileDownloadOutlined />}
            sx={{ borderRadius: "999px" }}
          >
            Export
          </Chip>
        </Divider>
      </Box>

      <ExportContent />

      <Box sx={{ my: 3 }}>
        <Divider
          sx={{
            "&::before, &::after": { opacity: 0.35 },
          }}
        >
          <Chip
            size="sm"
            variant="soft"
            startDecorator={<FileUploadOutlined />}
            sx={{ borderRadius: "999px" }}
          >
            Import
          </Chip>
        </Divider>
      </Box>

      <RuleImportContent />
    </>
  );
}
