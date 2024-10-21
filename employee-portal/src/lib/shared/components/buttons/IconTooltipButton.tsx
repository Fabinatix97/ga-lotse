/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InfoOutlined } from "@mui/icons-material";
import { IconButton as JoyIconButton, Tooltip } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { PropsWithChildren, ReactNode, forwardRef, useState } from "react";

import { BaseModal } from "@/lib/shared/components/BaseModal";

export function InfoIconTooltipButton({
  title,
  sx,
  size,
  iconLabelledBy,
  iconLabel: iconLabelProp,
}: Readonly<{
  title: ReactNode;
  sx?: SxProps;
  iconLabel?: string;
  iconLabelledBy?: string;
  size?: "sm" | "md" | "lg";
}>) {
  const iconLabel =
    !iconLabelledBy && !iconLabelProp ? "Mehr Informationen" : iconLabelProp;
  return (
    <IconTooltipButton
      icon={<InfoOutlined sx={sx} size={size} />}
      iconLabel={iconLabel}
      iconLabelledBy={iconLabelledBy}
      title={title}
    />
  );
}

export function IconTooltipButton({
  icon,
  iconLabel,
  iconLabelledBy,
  title,
}: Readonly<{
  icon: ReactNode;
  iconLabel?: string;
  iconLabelledBy?: string;
  title: ReactNode;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip arrow variant="outlined" title={title}>
        <IconButton
          aria-label={iconLabel}
          aria-labelledby={iconLabelledBy}
          onClick={() => setOpen(true)}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <BaseModal open={open} onClose={() => setOpen(false)}>
        {title}
      </BaseModal>
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
    <JoyIconButton color="primary" size="sm" {...props} ref={ref}>
      {props.children}
    </JoyIconButton>
  );
});
