/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

interface MedicalHistorySectionElementsProps {
  sectionTitle: string | undefined;
}

export function MedicalHistorySectionElements({
  sectionTitle,
  children,
}: Readonly<MedicalHistorySectionElementsProps & RequiresChildren>) {
  return (
    <Stack spacing={3} sx={{ marginBottom: 4 }}>
      {sectionTitle && (
        <Typography level="h4" component="h2" color="primary">
          {sectionTitle}
        </Typography>
      )}
      {children}
    </Stack>
  );
}
