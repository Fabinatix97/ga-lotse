/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Add,
  ArrowDropDownOutlined,
  FileUploadOutlined,
} from "@mui/icons-material";
import { Button, Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";

import { routes } from "../../../../config/routes";
import { useCreateChildSidebar } from "../createChild/CreateChildSidebar";
import { useImportChildrenSidebar } from "../import/ImportChildrenSidebar";

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
