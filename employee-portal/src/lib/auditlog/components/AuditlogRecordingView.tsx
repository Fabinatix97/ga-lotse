/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { GradingTwoTone } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";

import { AuditlogDeletePasswordButton } from "./AuditlogDeletePasswordButton";

export function AuditlogRecordingView() {
  return (
    <>
      <ButtonBar
        left={<FilterButton disabled />}
        right={<AuditlogDeletePasswordButton />}
      />
      <Sheet
        data-testid={"auditlogSheet"}
        sx={{
          pb: 8,
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          border: "none",
        }}
      >
        <Stack alignItems={"center"} gap={2}>
          <GradingTwoTone fontSize={"xl4"} />
          <Typography>Audit Logs werden aufgezeichnet</Typography>
        </Stack>
      </Sheet>
    </>
  );
}
