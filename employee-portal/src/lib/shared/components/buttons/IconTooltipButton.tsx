/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InfoOutlined } from "@mui/icons-material";
import {
  ColorPaletteProp,
  IconButton as JoyIconButton,
  Tooltip,
  TooltipProps,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { PropsWithChildren, ReactNode, forwardRef, useState } from "react";

import { OverlayBoundary } from "@eshg/lib-employee-portal";
import { BaseModal } from "@eshg/lib-portal/components/BaseModal";

export function SlimInfoIconTooltipButton({
  infoText,
  iconLabelledBy,
  title,
}: Readonly<{
  infoText: ReactNode;
  iconLabelledBy?: string;
  title: string;
}>) {
  return (
    <InfoIconTooltipButton
      iconLabelledBy={iconLabelledBy}
      infoText={infoText}
      tooltipColor="neutral"
      title={title}
      tooltipSx={{
        maxWidth: "16rem",
      }}
      tooltipPlacement="top"
      tooltipVariant="solid"
    />
  );
}

export function InfoIconTooltipButton({
  infoText,
  sx,
  iconSize,
  iconLabelledBy,
  tooltipColor,
  title,
  tooltipPlacement,
  tooltipSx,
  tooltipVariant,
}: Readonly<{
  infoText: ReactNode;
  sx?: SxProps;
  iconLabelledBy?: string;
  iconSize?: "sm" | "md" | "lg";
  title: string;
  tooltipSx?: SxProps;
  tooltipColor?: ColorPaletteProp;
  tooltipPlacement?: TooltipProps["placement"];
  tooltipVariant?: TooltipProps["variant"];
}>) {
  return (
    <IconTooltipButton
      icon={<InfoOutlined sx={sx} size={iconSize} />}
      iconLabelledBy={iconLabelledBy}
      infoText={infoText}
      tooltipColor={tooltipColor}
      title={title}
      tooltipSx={tooltipSx}
      tooltipPlacement={tooltipPlacement}
      tooltipVariant={tooltipVariant}
    />
  );
}

function IconTooltipButton({
  icon,
  iconLabelledBy,
  infoText,
  tooltipColor,
  title,
  tooltipPlacement,
  tooltipSx,
  tooltipVariant,
}: Readonly<{
  icon: ReactNode;
  iconLabelledBy?: string;
  infoText: ReactNode;
  title: string;
  tooltipPlacement?: TooltipProps["placement"];
  tooltipColor?: ColorPaletteProp;
  tooltipVariant?: TooltipProps["variant"];
  tooltipSx?: SxProps;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip
        arrow
        color={tooltipColor}
        variant={tooltipVariant ?? "outlined"}
        title={infoText}
        placement={tooltipPlacement}
        sx={tooltipSx}
      >
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
          modalTitle={title}
          onClose={() => setOpen(false)}
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
