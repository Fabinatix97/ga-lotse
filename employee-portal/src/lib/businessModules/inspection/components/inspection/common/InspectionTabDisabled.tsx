/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InfoOutlined } from "@mui/icons-material";
import { Sheet, Stack, SvgIcon, Typography } from "@mui/joy";

import { ButtonLink } from "@eshg/lib-portal";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";

export function InspectionTabDisabled({
  message,
  margin,
  procedureId,
  selfUserId,
}: Readonly<{
  message: string;
  margin: number;
  procedureId: string;
  selfUserId?: string;
}>) {
  const { mutateAsync: updateInspection } = useUpdateInspection();

  async function assignSelf() {
    await updateInspection({
      id: procedureId,
      apiUpdateInspectionRequest: {
        assigneeId: selfUserId,
      },
    });
  }

  return (
    <Sheet
      sx={{
        padding: 12,
        backgroundColor: "background.body",
        borderRadius: "lg",
        alignItems: "center",
        margin: { margin },
      }}
    >
      <Stack spacing={2} sx={{ alignItems: "center", marginBottom: 50 }}>
        <SvgIcon sx={{ width: "40px", height: "40px" }}>
          <InfoOutlined />
        </SvgIcon>
        <Typography textAlign="center" data-testid="message">
          {message}
        </Typography>
        {selfUserId && (
          <ButtonLink onClick={assignSelf}>Mir zuweisen</ButtonLink>
        )}
      </Stack>
    </Sheet>
  );
}
