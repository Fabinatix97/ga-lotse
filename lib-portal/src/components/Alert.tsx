/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AccountCircleOutlined,
  CheckCircleOutlined,
  CloseRounded,
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
  IconButton,
  Typography,
  TypographyProps,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode, Ref } from "react";
import { isDefined } from "remeda";

import { Row } from "./Row";
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
    case undefined:
      return <AccountCircleOutlined fontSize="xl2" />;
  }
}

function renderAction(
  action: AlertAction,
  color: AlertProps["color"],
  variant: AlertProps["variant"],
): ReactNode {
  const buttonProps = {
    "data-testid": "action",
    variant,
    size: "sm",
    color,
    sx: { textTransform: "uppercase" },
  } as const;

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
  onClose?: () => void;
  messageComponent?: TypographyProps["component"];
  ref?: Ref<HTMLDivElement>;
  role?: string;
}

export function Alert({
  ref,
  title,
  message,
  color,
  variant = "soft",
  action,
  sx,
  onClose,
  messageComponent,
  role = "note",
}: AlertProps) {
  return (
    <AlertJoy
      ref={ref}
      variant={variant}
      color={color}
      sx={{ ...sx, alignItems: "flex-start" }}
      startDecorator={renderIcon(color)}
      role={role}
      data-testid="alert"
    >
      <Row justifyContent="space-between" flex="1">
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
              {...(isDefined(messageComponent)
                ? { component: messageComponent }
                : {})}
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
        <EndDecorator
          color={color}
          action={action}
          variant={variant}
          onClose={onClose}
        />
      </Row>
    </AlertJoy>
  );
}

function EndDecorator({
  action,
  onClose,
  variant,
  color,
}: Pick<AlertProps, "action" | "onClose" | "variant" | "color">) {
  return (
    <>
      {isDefined(action) && renderAction(action, color, variant)}
      {isDefined(onClose) && (
        <IconButton
          variant="plain"
          color={color}
          size="sm"
          aria-label="Schließen"
          onClick={onClose}
        >
          <CloseRounded />
        </IconButton>
      )}
    </>
  );
}
