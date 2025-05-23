/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SvgIconComponent } from "@mui/icons-material";
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  SvgIconProps,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

import { InternalLinkButton, NavigationLink } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.up("xs")]: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: theme.breakpoints.values.xs,
    margin: "0 auto",
  },
});

const Title = styled("h2")({
  fontSize: theme.fontSize.md,
  margin: 0,
  [theme.breakpoints.up("xs")]: {
    textAlign: "center",
  },
});

const Description = styled("p")({
  margin: 0,
});

const iconStyles: SxProps = {
  fontSize: "4rem",
  "--Icon-margin": theme.spacing(2, "auto", 2, "auto"),
  [theme.breakpoints.up("xs")]: {
    "--Icon-margin": theme.spacing(0, 0, 2, 0),
  },
};

const buttonStyles: SxProps = {
  [theme.breakpoints.up("xs")]: {
    width: theme.breakpoints.values.xs / 2,
  },
};

export interface FormSuccessSheetProps {
  title: string;
  description: string;
  buttonLabel?: string;
  buttonHref?: string;
  onClick?: () => void;
  buttons?: ReactNode;
  icon?: SvgIconComponent;
  slotProps?: {
    root?: BoxProps;
    icon?: SvgIconProps & { sx?: SxProps };
    button?: Omit<
      ButtonProps & ButtonProps<typeof NavigationLink>,
      "onClick" | "component"
    >;
  };
}

export function FormSuccessSheet({
  title,
  description,
  buttonLabel,
  buttonHref,
  onClick,
  buttons,
  icon,
  slotProps,
}: Readonly<FormSuccessSheetProps>) {
  const Icon = icon;
  const buttonProps = {
    ...(slotProps?.button ?? {}),
    sx: { ...buttonStyles, ...(slotProps?.button?.sx ?? {}) },
  };

  return (
    <ContentSheet data-testid="form-success-sheet">
      <Container {...slotProps?.root}>
        {Icon && (
          <Icon
            color="success"
            {...slotProps?.icon}
            sx={{ ...iconStyles, ...(slotProps?.icon?.sx ?? {}) } as SxProps}
          />
        )}
        <Title>{title}</Title>
        <Description>{description}</Description>
        {buttons ??
          (buttonLabel &&
            ((buttonHref && (
              <InternalLinkButton href={buttonHref} {...buttonProps}>
                {buttonLabel}
              </InternalLinkButton>
            )) ??
              (onClick && (
                <Button onClick={onClick} {...buttonProps}>
                  {buttonLabel}
                </Button>
              ))))}
      </Container>
    </ContentSheet>
  );
}
