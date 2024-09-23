/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

export interface InfoTileProps extends RequiresChildren {
  name: string;
  title: string;
  onEdit?: () => void;
  footer?: ReactNode;
}

export function InfoTile({
  name,
  title,
  onEdit,
  children,
  footer,
}: InfoTileProps) {
  return (
    <InformationSheet>
      <div style={{ flexGrow: 1 }}>
        <DetailsSection name={name} title={title} onEdit={onEdit}>
          <Grid container columns={1} spacing={2} style={{ flexGrow: 1 }}>
            <Grid xs sx={{ flex: 1 }}>
              <Stack spacing={2}>{children}</Stack>
            </Grid>
          </Grid>
        </DetailsSection>
      </div>
      {footer}
    </InformationSheet>
  );
}
