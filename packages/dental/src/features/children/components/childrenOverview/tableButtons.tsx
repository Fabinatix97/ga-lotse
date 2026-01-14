/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Add,
  ArrowDropDownOutlined,
  FileDownloadOutlined,
  FileUploadOutlined,
} from "@mui/icons-material";
import { Button, Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";

import { NavigationLink } from "@eshg/lib-portal";

import { routes } from "../../../../config/routes";
import { useCreateChildSidebar } from "../createChild/CreateChildSidebar";
import { useImportChildrenSidebar } from "../import/ImportChildrenSidebar";

import { useExportChildDataSidebar } from "./ExportChildDataSidebar";

export function ImportChildrenButton() {
  const importChildrenSidebar = useImportChildrenSidebar();

  return (
    <Button
      size="md"
      variant="outlined"
      startDecorator={<FileUploadOutlined />}
      onClick={importChildrenSidebar.open}
    >
      Daten importieren
    </Button>
  );
}

export function ExportChildDataButton() {
  const exportChildData = useExportChildDataSidebar();

  return (
    <Button
      size="md"
      variant="outlined"
      startDecorator={<FileDownloadOutlined />}
      onClick={exportChildData.open}
    >
      Daten exportieren
    </Button>
  );
}

export function CreateChildButton() {
  const createChildSidebar = useCreateChildSidebar();

  return (
    <Button
      size="md"
      variant="outlined"
      startDecorator={<Add />}
      onClick={createChildSidebar.open}
    >
      Kind anlegen
    </Button>
  );
}

export function SchoolYearTransitionButton() {
  return (
    <Dropdown>
      <MenuButton
        variant="solid"
        color="primary"
        endDecorator={<ArrowDropDownOutlined />}
      >
        Schuljahreswechsel
      </MenuButton>
      <Menu variant="soft" color="primary" sx={{ width: 198 }}>
        <MenuItem
          component={NavigationLink}
          href={routes.children.schoolYearTransition.daycares}
        >
          Kitas
        </MenuItem>
        <MenuItem
          component={NavigationLink}
          href={routes.children.schoolYearTransition.schools}
        >
          Schulen
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
