/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { FileLike } from "@eshg/lib-portal/components/formFields/file/validators";
import { formatFileSize } from "@eshg/lib-portal/helpers/file";
import { DeleteOutlined } from "@mui/icons-material";
import { Box, IconButton, Sheet, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";

import { theme } from "@/lib/baseModule/theme/theme";
import { byBreakpoint } from "@/lib/shared/breakpoints";

export interface FileSheet {
  file: File;
  acceptedFileTypes: FileType[];
  removeLabel?: string;
  onDelete?: () => Promise<void>;
}
export function FileSheet({
  file,
  acceptedFileTypes,
  onDelete,
  removeLabel,
}: Readonly<FileSheet>) {
  return (
    <Sheet
      key={`${file.name}+${file.size}`}
      sx={{
        borderRadius: byBreakpoint({
          mobile: theme.radius.xs,
          desktop: theme.radius.md,
        }),
        padding: 2,
      }}
    >
      <ResponsiveGrid>
        <Typography sx={{ gridArea: "fileName", wordBreak: "break-all" }}>
          {file.name}
        </Typography>
        <Typography sx={{ gridArea: "fileFormat", justifySelf: "end" }}>
          {formatFileType(acceptedFileTypes, file)}
        </Typography>
        <Typography
          sx={{
            gridArea: "fileSize",
            justifySelf: byBreakpoint({
              mobile: "start",
              desktop: "end",
            }),
          }}
        >
          {formatFileSize(file.size)}
        </Typography>
        {onDelete && (
          <IconButton
            aria-label={removeLabel}
            color="danger"
            onClick={onDelete}
            sx={{
              minHeight: "24px",
              minWidth: "24px",
              paddingX: 0,
              gridArea: "deleteButton",
              alignSelf: "start",
            }}
          >
            <DeleteOutlined />
          </IconButton>
        )}
      </ResponsiveGrid>
    </Sheet>
  );
}

function formatFileType(acceptedFileType: FileType[], file: FileLike) {
  return acceptedFileType.map((fileType) => {
    if (file.type === fileType.mimeType) {
      return fileType.name;
    }
  });
}

function ResponsiveGrid({ children }: Readonly<PropsWithChildren>) {
  return (
    <Box
      sx={{
        display: "grid",
        rowGap: 0.5,
        columnGap: 2,
        gridTemplateColumns: byBreakpoint({
          mobile: "65% 1fr max-content",
          desktop: "70% 1fr 1fr max-content",
        }),
        gridTemplateAreas: byBreakpoint({
          mobile: '"fileName fileFormat deleteButton" "fileSize . ."',
          desktop: '"fileName fileFormat fileSize deleteButton"',
        }),
      }}
    >
      {children}
    </Box>
  );
}
