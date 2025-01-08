/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  Stack,
  Typography,
} from "@mui/joy";
import { ColorPaletteProp, SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

export interface ActionsItem {
  label: string;
  onClick: string | (() => void) | (() => Promise<void>);
  startDecorator?: ReactNode;
  color?: ColorPaletteProp;
  disabled?: boolean;
}

export interface ActionsMenuProps extends MenuButtonProps {
  actionItems: ActionsItem[];
  actionDescription?: string;
  sx?: SxProps;
  color?: ColorPaletteProp;
  rowHeight?: boolean;
}

function ActionLabel({
  label,
  startDecorator,
  sx,
  color,
}: {
  label: string;
  startDecorator: ReactNode;
  sx?: SxProps;
  color?: ColorPaletteProp;
}) {
  return (
    <Typography
      component="span"
      level="body-md"
      startDecorator={startDecorator}
      color={color}
      slotProps={{
        startDecorator: {
          sx: {
            fontSize: "sm",
            marginRight: (theme) => theme.spacing(2),
            "--Icon-color": color ?? "neutral.700",
          },
        },
      }}
      sx={sx}
    >
      {label}
    </Typography>
  );
}

export function createActionsLinkOrButton(item: ActionsItem) {
  if (typeof item.onClick === "string") {
    return (
      <MenuItem key={item.label} sx={{ padding: 0 }} disabled={item.disabled}>
        <InternalLinkButton
          key={item.label}
          variant="plain"
          color="neutral"
          href={item.onClick}
          sx={{
            width: "100%",
            "&:hover": { backgroundColor: "transparent" },
            ...(item.disabled && { opacity: 0.5 }),
          }}
        >
          <ActionLabel
            color={item.color}
            label={item.label}
            startDecorator={item.startDecorator}
            sx={{ marginRight: "auto" }}
          />
        </InternalLinkButton>
      </MenuItem>
    );
  } else {
    return (
      <MenuItem
        key={item.label}
        sx={{ padding: 0 }}
        onClick={item.onClick}
        disabled={item.disabled}
      >
        <ActionLabel
          color={item.color}
          label={item.label}
          startDecorator={item.startDecorator}
          sx={{
            paddingX: 2,
            ...(item.disabled && { opacity: 0.5 }),
          }}
        />
      </MenuItem>
    );
  }
}

export function ActionsMenu(props: ActionsMenuProps) {
  const { actionItems, actionDescription, rowHeight, ...rest } = props;

  return (
    <Dropdown>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ height: rowHeight ? 3 : undefined }}
      >
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: props.variant, color: props.color } }}
          aria-label={actionDescription ?? "Aktionen"}
          sx={{
            "&[aria-expanded=true]": {
              backgroundColor: (theme) =>
                `${theme.palette.primary.outlinedActiveBg}`,
              border: (theme) =>
                `1px solid ${theme.palette.primary.outlinedBorder}`,
            },
            ...props.sx,
          }}
          {...rest}
        >
          <MoreVertIcon color={props.color ?? "primary"} />
        </MenuButton>
        <Menu placement="bottom-end">
          {actionItems.map((item) => createActionsLinkOrButton(item))}
        </Menu>
      </Stack>
    </Dropdown>
  );
}
