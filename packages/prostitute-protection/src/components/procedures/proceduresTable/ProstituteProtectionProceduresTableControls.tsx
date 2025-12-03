/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { ButtonBar } from "@eshg/lib-employee-portal";

import { useAddNewProcedureSidebar } from "../addNewProcedure/useAddNewProcedureSidebar";

export function ProstituteProtectionProceduresTableControls() {
  return <ButtonBar left={null} right={<ControlsRight />} />;
}

function ControlsRight() {
  const { open } = useAddNewProcedureSidebar();

  return (
    <Button startDecorator={<Add />} onClick={open}>
      Neuen Vorgang anlegen
    </Button>
  );
}
