/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DetailsSection } from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Box, Grid, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

export interface InfoTileProps extends RequiresChildren {
  name: string;
  title: string;
  onEdit?: () => void;
  footer?: ReactNode;
  controls?: ReactNode;
  "data-testid"?: string;
}

export function InfoTile({
  "data-testid": testId,
  name,
  title,
  onEdit,
  children,
  footer,
  controls,
}: InfoTileProps) {
  return (
    <InformationSheet data-testid={testId}>
      <Box flexGrow={1}>
        <DetailsSection
          data-testid={name}
          title={title}
          onEdit={onEdit}
          buttons={controls}
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
