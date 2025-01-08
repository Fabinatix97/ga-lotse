/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { InfoOutlined } from "@mui/icons-material";
import {
  ColorPaletteProp,
  IconButton as JoyIconButton,
  Tooltip,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { PropsWithChildren, ReactNode, forwardRef, useState } from "react";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

export function InfoIconTooltipButton({
  infoText,
  sx,
  size,
  iconLabelledBy,
  tooltipColor,
  title,
}: Readonly<{
  infoText: ReactNode;
  sx?: SxProps;
  iconLabelledBy?: string;
  size?: "sm" | "md" | "lg";
  tooltipColor?: ColorPaletteProp;
  title: string;
}>) {
  return (
    <IconTooltipButton
      icon={<InfoOutlined sx={sx} size={size} />}
      iconLabelledBy={iconLabelledBy}
      infoText={infoText}
      tooltipColor={tooltipColor}
      title={title}
    />
  );
}

export function IconTooltipButton({
  icon,
  iconLabelledBy,
  infoText,
  tooltipColor,
  title,
}: Readonly<{
  icon: ReactNode;
  iconLabelledBy?: string;
  infoText: ReactNode;
  tooltipColor?: ColorPaletteProp;
  title: string;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip arrow color={tooltipColor} variant="outlined" title={infoText}>
        <IconButton
          aria-label={title}
          aria-labelledby={iconLabelledBy}
          onClick={() => setOpen(true)}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <OverlayBoundary>
        <BaseModal
          open={open}
          onClose={() => setOpen(false)}
          modalTitle={title}
        >
          <Typography>{infoText}</Typography>
        </BaseModal>
      </OverlayBoundary>
    </>
  );
}

const IconButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<{
    "aria-label"?: string;
    "aria-labelledby"?: string;
    onClick: () => void;
  }>
>(function IconButton(props, ref) {
  return (
    <JoyIconButton
      color="primary"
      size="sm"
      sx={{
        // shift up by the extra padding of the button
        marginY: -1,
      }}
      {...props}
      ref={ref}
    >
      {props.children}
    </JoyIconButton>
  );
});
