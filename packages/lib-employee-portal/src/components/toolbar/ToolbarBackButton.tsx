/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronLeft } from "@mui/icons-material";
import { ButtonProps, IconButton, Theme, styled } from "@mui/joy";

import { InternalLinkIconButton } from "@eshg/lib-portal";

function backIconButtonStyles({ theme }: { theme: Theme }) {
  return {
    width: "3.25rem",
    backgroundColor: theme.palette.background.surface,
    borderRadius: 0,
    "&:focus-visible": { outlineOffset: -2 },
    "& .MuiSvgIcon-root": {
      fontSize: "2.25rem",
    },
  };
}

const BackIconButton = styled(IconButton)(backIconButtonStyles);

const BackInternalLinkIconButton = styled(InternalLinkIconButton)(
  backIconButtonStyles,
);

const COMMON_BUTTON_PROPS = {
  "aria-label": "Zurück",
  variant: "plain",
  color: "neutral",
} satisfies ButtonProps;

type ToolbarBackButtonProps = { href: string } | { onClick: () => void };

export function ToolbarBackButton(props: ToolbarBackButtonProps) {
  if ("onClick" in props) {
    return (
      <BackIconButton {...COMMON_BUTTON_PROPS} onClick={props.onClick}>
        <ChevronLeft />
      </BackIconButton>
    );
  }

  return (
    <BackInternalLinkIconButton {...COMMON_BUTTON_PROPS} href={props.href}>
      <ChevronLeft />
    </BackInternalLinkIconButton>
  );
}
