/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Grid, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

import { DetailsSection, InformationSheet } from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

interface InfoTileProps extends RequiresChildren {
  name: string;
  title: string;
  onEdit?: () => void;
  footer?: ReactNode;
  controls?: ReactNode;
  "data-testid"?: string;
  sx?: SxProps;
}

export function InfoTile({
  "data-testid": testId,
  name,
  title,
  onEdit,
  children,
  footer,
  controls,
  sx,
}: InfoTileProps) {
  return (
    <InformationSheet data-testid={testId} sx={{ ...sx }}>
      <Box flexGrow={1}>
        <DetailsSection
          data-testid={name}
          title={title}
          buttons={controls}
          onEdit={onEdit}
        >
          <Grid container columns={1} spacing={2} flexGrow={1}>
            <Grid xs flex={1}>
              <Stack spacing={2}>{children}</Stack>
            </Grid>
          </Grid>
        </DetailsSection>
      </Box>
      {footer}
    </InformationSheet>
  );
}
