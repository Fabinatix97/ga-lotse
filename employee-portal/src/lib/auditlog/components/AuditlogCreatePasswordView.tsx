/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ButtonBar,
  OverlayBoundary,
  ToggleFilterButton,
} from "@eshg/lib-employee-portal";
import { CancelOutlined, KeyOutlined } from "@mui/icons-material";
import { Button, Sheet, Stack, Typography } from "@mui/joy";
import { Dispatch, SetStateAction, useState } from "react";

import { AuditlogCreatePasswordSidebar } from "@/lib/auditlog/components/AuditlogCreatePasswordSidebar";

export function AuditlogCreatePasswordView() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ButtonBar
        left={<ToggleFilterButton disabled />}
        right={<CreatePasswordButton setOpen={setOpen} />}
      />
      <Sheet
        data-testid={"auditlogSheet"}
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          border: "none",
        }}
      >
        <Stack alignItems={"center"} gap={2}>
          <CancelOutlined fontSize={"xl4"} />
          <Typography>
            Passwort erstellen, um Audit Logs aufzuzeichnen
          </Typography>
          <CreatePasswordButton setOpen={setOpen} />
        </Stack>
      </Sheet>

      <OverlayBoundary>
        {open && (
          <AuditlogCreatePasswordSidebar
            open={open}
            onClose={() => setOpen(false)}
          />
        )}
      </OverlayBoundary>
    </>
  );
}

interface CreatePasswordButtonProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function CreatePasswordButton({
  setOpen,
}: Readonly<CreatePasswordButtonProps>) {
  return (
    <Button onClick={() => setOpen(true)} startDecorator={<KeyOutlined />}>
      Passwort erstellen
    </Button>
  );
}
