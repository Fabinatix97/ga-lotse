/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AddOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useAddNewProcedureSidebar } from "./useAddNewProcedureSidebar";

export function NewPerson() {
  const { open } = useAddNewProcedureSidebar();

  return (
    <Button startDecorator={<AddOutlined />} onClick={open}>
      Neuen Vorgang anlegen
    </Button>
  );
}
