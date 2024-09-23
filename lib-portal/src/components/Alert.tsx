/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AccountCircleOutlined,
  CheckCircleOutlined,
  ErrorOutlineOutlined,
  InfoOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Alert as AlertJoy,
  AlertProps as AlertPropsJoy,
  Box,
  Button,
  ButtonProps,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { InternalLinkButton } from "./navigation/InternalLinkButton";

type AlertAction = ButtonActionProps | LinkActionProps | ActionRenderer;

interface ButtonActionProps {
  text: string;
  onClick: () => void;
}

interface LinkActionProps {
  text: string;
  href: string;
}

type ActionRenderer = (buttonProps: ActionButtonProps) => ReactNode;

export type ActionButtonProps = Pick<
  ButtonProps,
  "variant" | "size" | "color" | "sx"
>;

function renderIcon(color: AlertPropsJoy["color"]): ReactNode {
  switch (color) {
    case "primary":
      return <InfoOutlined fontSize="xl2" />;
    case "success":
      return <CheckCircleOutlined fontSize="xl2" />;
    case "warning":
      return <WarningAmberOutlined fontSize="xl2" />;
    case "danger":
      return <ErrorOutlineOutlined fontSize="xl2" />;
    case "neutral":
      return <AccountCircleOutlined fontSize="xl2" />;
  }
}

function renderAction(
  action: AlertAction,
  color: AlertProps["color"],
  variant: AlertProps["variant"],
): ReactNode {
  const buttonProps: ActionButtonProps = {
    variant,
    size: "sm",
    color,
    sx: { textTransform: "uppercase" },
  };

  if ("href" in action) {
    return (
      <InternalLinkButton {...buttonProps} href={action.href}>
        {action.text}
      </InternalLinkButton>
    );
  }

  if ("onClick" in action) {
    return (
      <Button {...buttonProps} onClick={action.onClick}>
        {action.text}
      </Button>
    );
  }

  return action(buttonProps);
}

export interface AlertProps {
  title?: string;
  message?: ReactNode;
  color: AlertPropsJoy["color"];
  variant?: Extract<AlertPropsJoy["variant"], "soft" | "outlined">;
  action?: AlertAction;
  sx?: SxProps;
}

export function Alert({
  title,
  message,
  color,
  variant = "soft",
  action,
  sx,
}: AlertProps) {
  return (
    <AlertJoy
      variant={variant}
      color={color}
      sx={{ ...sx, alignItems: "flex-start" }}
      startDecorator={renderIcon(color)}
      endDecorator={
        isDefined(action) ? renderAction(action, color, variant) : undefined
      }
    >
      <Box>
        {isDefined(title) && (
          <Typography
            color={color}
            variant={variant}
            level="title-md"
            fontWeight="lg"
            data-testid="title"
          >
            {title}
          </Typography>
        )}
        {isDefined(message) && (
          <Typography
            color={color}
            variant={variant}
            level="body-md"
            sx={{
              fontSize: {
                xs: "sm",
                sm: "md",
              },
            }}
            data-testid="message"
          >
            {message}
          </Typography>
        )}
      </Box>
    </AlertJoy>
  );
}
