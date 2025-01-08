/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLabel } from "@eshg/employee-portal-api/base";
import { Add as AddIcon } from "@mui/icons-material";
import { Chip, Dropdown, Menu, MenuButton, MenuItem, Stack } from "@mui/joy";

export function MoreLabelsButton({
  labels,
  visible,
}: {
  labels: ApiLabel[];
  visible: number;
}) {
  if (visible >= labels.length) {
    return null;
  }

  return (
    <Dropdown>
      <MenuButton
        variant={"plain"}
        size={"sm"}
        sx={{
          minHeight: 0,
          padding: 0,
          borderRadius: "var(--Chip-radius, 1.5rem)",
        }}
      >
        <Chip variant={"outlined"} color={"neutral"}>
          <Stack direction={"row"} alignItems={"center"}>
            <AddIcon size={"xs"} />
            {labels.length - visible}
          </Stack>
        </Chip>
      </MenuButton>
      <Menu title={"title"}>
        {labels.map((label) => (
          <MenuItem key={label.id}>{label.name}</MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
}
