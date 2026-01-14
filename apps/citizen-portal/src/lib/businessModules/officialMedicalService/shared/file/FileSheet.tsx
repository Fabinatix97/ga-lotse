/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DeleteOutlined } from "@mui/icons-material";
import { Box, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";
import { isDefined } from "remeda";

import { FormHelperTextWithIcon, formatFileSize } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { FileDescriptor } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import { byBreakpoint } from "@/lib/shared/breakpoints";

export interface FileSheetProps {
  file: FileDescriptor;
  removeLabel?: string;
  onRemove?: () => void;
  ref?: (el: HTMLAnchorElement) => void;
}

export function FileSheet({
  file,
  onRemove,
  removeLabel,
  ref,
}: Readonly<FileSheetProps>) {
  return (
    <Stack>
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
            {file.fileType}
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
          {onRemove && (
            <IconButton
              ref={ref}
              aria-label={removeLabel}
              color="danger"
              sx={{
                minHeight: "24px",
                minWidth: "24px",
                paddingX: 0,
                gridArea: "deleteButton",
                alignSelf: "start",
              }}
              onClick={() => onRemove()}
            >
              <DeleteOutlined />
            </IconButton>
          )}
        </ResponsiveGrid>
      </Sheet>
      {isDefined(file.helperText) && (
        <FormHelperTextWithIcon
          test-id="file-helper-text"
          id={`${file.name}+${file.size}-helper-text`}
          helperText={file.helperText}
        />
      )}
    </Stack>
  );
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
