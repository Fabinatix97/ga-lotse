/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import {
  ButtonBar,
  SearchFilter,
  UseTableControlResult,
} from "@eshg/lib-employee-portal";

import { useAddNewProcedureSidebar } from "../addNewProcedure/useAddNewProcedureSidebar";

interface ProceduresTableControlsProps {
  tableControl: UseTableControlResult;
}

export function ProstituteProtectionProceduresTableControls({
  tableControl,
}: ProceduresTableControlsProps) {
  const { open } = useAddNewProcedureSidebar();

  return (
    <ButtonBar
      left={
        <SearchFilter
          tableControl={tableControl}
          searchParamName="alias"
          label="Alias Suche"
          aria-label="Alias"
        />
      }
      right={
        <Button autoFocus startDecorator={<Add />} onClick={open}>
          Neuen Vorgang anlegen
        </Button>
      }
      invertDomOrder
    />
  );
}
