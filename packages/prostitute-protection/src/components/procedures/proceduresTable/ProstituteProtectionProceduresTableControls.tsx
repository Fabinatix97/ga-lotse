/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import {
  ButtonBar,
  TogglePersonSearchButton,
  usePersonSearchFromURL,
} from "@eshg/lib-employee-portal";

import { useAddNewProcedureSidebar } from "../../sidebar/useAddNewProcedureSidebar";

interface ProstituteProtectionProceduresTableControlsProps {
  handleSearch: () => void;
  isSearchVisible: boolean;
}

export function ProstituteProtectionProceduresTableControls({
  handleSearch,
  isSearchVisible,
}: ProstituteProtectionProceduresTableControlsProps) {
  const personSearch = usePersonSearchFromURL();

  return (
    <ButtonBar
      left={
        <TogglePersonSearchButton
          {...personSearch.buttonProps}
          expanded={isSearchVisible}
          onClick={handleSearch}
        />
      }
      right={<ControlsRight />}
    />
  );
}

function ControlsRight() {
  const { open } = useAddNewProcedureSidebar();

  return (
    <Button startDecorator={<Add />} onClick={open}>
      Neuen Vorgang anlegen
    </Button>
  );
}
